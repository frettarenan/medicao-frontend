import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MessageService } from 'primeng/api';
import { LancamentoService } from 'app/lancamentos/lancamento.service';
import { ServicoService } from 'app/servicos/servico.service';
import { GrupoService } from 'app/grupos/grupo.service';
import { Servico, Grupo, GrupoHierarquia, Lancamento } from 'app/core/model';

import * as $ from 'jquery';

@Component({
  selector: 'app-matriz-medicao-cadastro',
  templateUrl: './matriz-medicao-cadastro.component.html',
  styleUrls: ['./matriz-medicao-cadastro.component.scss']
})
export class MatrizMedicaoCadastroComponent implements OnInit {

  processando = true;

  servicos = null;
  grupos = null;
  lancamentos = null;

  matriz = null;

  //hierarquiaGrupos = null;

  constructor(
    private servicoService: ServicoService,
    private grupoService: GrupoService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    const idMedicao = this.route.snapshot.params['id'];

    this.title.setTitle('Edição da Matriz de Medição');

    if (idMedicao) {
      this.carregarServicos(idMedicao);
      this.carregarGrupos(idMedicao);
      this.carregarLancamentos(idMedicao);
    }

    /*$(document).ready(function() {
    });*/
  }

  carregarServicos(idMedicao: number) {
    this.servicoService.listarServicosPorMedicao(idMedicao)
      .then(servicos => {
        this.servicos = servicos;
        this.processaAposFinalizacaoDasRequisicoes();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarGrupos(idMedicao: number) {
    this.grupoService.listarGruposPorMedicao(idMedicao)
      .then(grupos => {
        this.grupos = grupos;
        this.processaAposFinalizacaoDasRequisicoes();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarLancamentos(idMedicao: number) {
    this.lancamentoService.listarLancamentosPorMedicao(idMedicao)
      .then(lancamentos => {
        this.lancamentos = lancamentos;
        this.processaAposFinalizacaoDasRequisicoes();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  processaAposFinalizacaoDasRequisicoes() {
    if (this.servicos && this.grupos && this.lancamentos) {
      this.populaGruposFicticios();
      // this.hierarquiaGrupos = this.getHierarquiaGruposRecursivo(null);
      // console.log(this.hierarquiaGrupos);
      this.populaMatriz();
      // console.log(this.matriz);
      this.processando = false;
    }
  }

  getHierarquiaGruposRecursivo(idGrupoPai):Array<GrupoHierarquia> {
    let localArray = new Array<GrupoHierarquia>();
    this.grupos.forEach(grupo => {
      if (grupo.obraGrupoPai == idGrupoPai || (grupo.obraGrupoPai != null && grupo.obraGrupoPai.id == idGrupoPai)) {

        let grupoHierarquia:GrupoHierarquia = new GrupoHierarquia();
        grupoHierarquia.id = grupo.id;
        grupoHierarquia.nome = grupo.nome;
        grupoHierarquia.children = this.getHierarquiaGruposRecursivo(grupo.id);

        localArray.push(grupoHierarquia);
      }
    });
    return localArray;
  }

  populaGruposFicticios() {
    let grupo = null;
      
    grupo = new Grupo();
    grupo.id = -1;
    grupo.nome = "TOTAL DO CONTRATO";
    this.grupos.unshift(grupo);

    grupo = new Grupo();      
    grupo.id = -2;
    grupo.nome = "SUBTOTAL";
    this.grupos.push(grupo);
  }

  populaMatriz() {
    this.matriz = {};
    console.log(this.lancamentos);
    this.grupos.forEach(grupo => {
      if (grupo.id > 0 && !this.grupoPossuiFilhos(grupo)) {
        this.servicos.forEach(servico => {  
          if (servico.id > 0) {
            //let adicionouGruposDeControle = false;
            //if (!adicionouGruposDeControle) {
              this.matriz["idServico" + servico.id + "idGrupo-1"] = {quantidade: null, cub: null};
              this.matriz["idServico" + servico.id + "idGrupo-2"] = {quantidade: null, cub: null, porcentagem: null};
              //adicionouGruposDeControle = true;
            //}
            let lancamento:Lancamento = this.getLancamento(servico, grupo);
            //debugger;
            this.matriz["idServico" + servico.id + "idGrupo" + grupo.id] = {quantidade: lancamento.valorQuantidade, cub: lancamento.valorUnidadeMedida, porcentagem: lancamento.valorPercentual};
          }
        });
      }
    });
    console.log(this.matriz);
  }

  getLancamento(servico:Servico, grupo:Grupo):any {
    for (let i = 0; i < this.lancamentos.length; i++) {
      const lancamentoI = this.lancamentos[i];
      if (lancamentoI.id.idObraGrupo == grupo.id && lancamentoI.id.idContratoServico == servico.id) {
        return lancamentoI;
      }
    }
    let lancamento:Lancamento = new Lancamento();
    lancamento.valorQuantidade = null;
    lancamento.valorUnidadeMedida = null;
    lancamento.valorPercentual = 0;
    return lancamento;
  }

  grupoPossuiFilhos(grupo) {
    /* for (let i = 0; i < this.grupos.length; i++) {
      const grupoI = this.grupos[i];
      if (grupoI.id > 0 && grupoI.obraGrupoPai != null && grupo.id == grupoI.obraGrupoPai.id) {
        return true;
      }
    }*/
    return false;
  }

  calcularTotais() {
    this.somarQuantidades();
    this.calcularCubGrupos();
    this.calcularQuantidadeTotalizador();
    this.calcularCubTotalizador();
    this.calcularPorcentualTotalizador();
  }

  somarQuantidades() {
    let quantidadeBase:number = 0;
    this.servicos.forEach(servico => {
      quantidadeBase = 0;
      this.grupos.forEach(grupo => {
        if (grupo.id > 0) {
          quantidadeBase += this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade;
        }
      });
      this.matriz["idServico" + servico.id + "idGrupo-1"].quantidade=quantidadeBase;
    });
  }

  calcularCubGrupos() {
    let cubGrupo:number = 0;
    this.servicos.forEach(servico => {
      this.grupos.forEach(grupo => {
        if (grupo.id > 0) {
          //alert(this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade + "/" + this.matriz["idServico" + servico.id + "idGrupo-1"].quantidade + "*" + this.matriz["idServico" + servico.id + "idGrupo-1"].cub);
          cubGrupo = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade / this.matriz["idServico" + servico.id + "idGrupo-1"].quantidade * this.matriz["idServico" + servico.id + "idGrupo-1"].cub;
          // quantidade subsolo / quantidade geral * cub geral
          this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].cub = cubGrupo.toFixed(2);
        }
      });
    });
  }

  calcularQuantidadeTotalizador() {
    let quantidadeTotalizador:number = 0;
    this.servicos.forEach(servico => {
      quantidadeTotalizador = 0;
      this.grupos.forEach(grupo => {
        if (grupo.id > 0) {
          quantidadeTotalizador += (this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].porcentagem / 100) * this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade;
          // += percentual grupo / 100 * quantidade grupo
        }
      });
      this.matriz["idServico" + servico.id + "idGrupo-2"].quantidade = quantidadeTotalizador.toFixed(2);
    });
  }

  calcularCubTotalizador() {
    let cubTotalizador:number = 0;
    this.servicos.forEach(servico => {
      cubTotalizador = 0;
      this.grupos.forEach(grupo => {
        if (grupo.id > 0) {
          cubTotalizador += (this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].porcentagem / 100) * this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].cub;
          // += percentual grupo / 100 * cub grupo
        }
      });
      this.matriz["idServico" + servico.id + "idGrupo-2"].cub = cubTotalizador.toFixed(2);
    });
  }

  calcularPorcentualTotalizador() {
    let porcentualTotalizador:number = 0;
    this.servicos.forEach(servico => {
      porcentualTotalizador = 0;
      porcentualTotalizador += (this.matriz["idServico" + servico.id + "idGrupo-2"].quantidade / this.matriz["idServico" + servico.id + "idGrupo-1"].quantidade) * 100;
      // quantidade totalizador / quantidade valor base
      this.matriz["idServico" + servico.id + "idGrupo-2"].porcentagem = porcentualTotalizador.toFixed(2);
    });
  }

}

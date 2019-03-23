import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MessageService } from 'primeng/api';
import { LancamentoService } from 'app/lancamentos/lancamento.service';
import { ServicoService } from 'app/servicos/servico.service';
import { GrupoService } from 'app/grupos/grupo.service';
import { Servico, Grupo, Lancamento } from 'app/core/model';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import * as $ from 'jquery';

@Component({
  selector: 'app-matriz-medicao-cadastro',
  templateUrl: './matriz-medicao-cadastro.component.html',
  styleUrls: ['./matriz-medicao-cadastro.component.scss']
})
export class MatrizMedicaoCadastroComponent implements OnInit {

  processando = true;

  idGrupoComTipoGrupo1 = null;
  idGrupoComTipoGrupo2 = null;

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
      this.populaGrupoControle();
      this.populaMatriz();
      this.calcularTotais();
      this.processando = false;
    }
  }

  populaGrupoControle() {
    this.idGrupoComTipoGrupo1 = this.grupos[0].id;
    this.idGrupoComTipoGrupo2 = this.grupos[this.grupos.length-1].id;
  }

  populaMatriz() {
    // console.log(this.lancamentos);
    this.matriz = {};
    this.grupos.forEach(grupo => {
      this.servicos.forEach(servico => {
        let lancamento:Lancamento = this.getLancamento(servico, grupo);
        //debugger;
        this.matriz["idServico" + servico.id + "idGrupo" + grupo.id] = {quantidade: lancamento.quantidade, cub: lancamento.cub, percentual: lancamento.percentual};
      });
    });
    // console.log(this.matriz);
  }

  getLancamento(servico:Servico, grupo:Grupo):any {
    for (let i = 0; i < this.lancamentos.length; i++) {
      const lancamentoI = this.lancamentos[i];
      if (lancamentoI.id.idGrupo == grupo.id && lancamentoI.id.idServico == servico.id) {
        return lancamentoI;
      }
    }
    let lancamento:Lancamento = new Lancamento();
    lancamento.quantidade = null;
    lancamento.cub = null;
    lancamento.percentual = null;
    return lancamento;
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
        if (grupo.tipoGrupo.id != 1 && grupo.tipoGrupo.id != 2) {
          let quantidade = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade;
          if (quantidade == null) {
            quantidade = 0;
          }
          quantidadeBase += quantidade;
        }
      });
      this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo1].quantidade=quantidadeBase;
    });
  }

  calcularCubGrupos() {
    let cubGrupo:number = 0;
    this.servicos.forEach(servico => {
      this.grupos.forEach(grupo => {
        if (grupo.tipoGrupo.id != 1 && grupo.tipoGrupo.id != 2) {
          // alert(this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade + "/" + this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo1].quantidade + "*" + this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo1].cub);
          let quantidadeCelula = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade;
          if (quantidadeCelula == null) {
            quantidadeCelula = 0;
          }
          let quantidadeGrupoComTipoGrupo1 = this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo1].quantidade;
          if (quantidadeGrupoComTipoGrupo1 == null) {
            quantidadeGrupoComTipoGrupo1 = 0;
          }
          let cubGrupoComTipoGrupo1 = this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo1].cub;
          if (cubGrupoComTipoGrupo1 == null) {
            cubGrupoComTipoGrupo1 = 0;
          }
          cubGrupo = quantidadeCelula / quantidadeGrupoComTipoGrupo1 * cubGrupoComTipoGrupo1;
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
        if (grupo.tipoGrupo.id != 1 && grupo.tipoGrupo.id != 2) {
          let percentualCelula = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].percentual;
          if (percentualCelula == null) {
            percentualCelula = 0;
          }
          let quantidadeCelula = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade;
          if (quantidadeCelula == null) {
            quantidadeCelula = 0;
          }
          quantidadeTotalizador += (percentualCelula / 100) * quantidadeCelula;
          // += percentual grupo / 100 * quantidade grupo
        }
      });
      this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo2].quantidade = quantidadeTotalizador.toFixed(2);
    });
  }

  calcularCubTotalizador() {
    let cubTotalizador:number = 0;
    this.servicos.forEach(servico => {
      cubTotalizador = 0;
      this.grupos.forEach(grupo => {
        if (grupo.tipoGrupo.id != 1 && grupo.tipoGrupo.id != 2) {
          let percentualCelula = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].percentual;
          if (percentualCelula == null) {
            percentualCelula = 0;
          }
          let cubCelula = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].cub;
          if (cubCelula == null) {
            cubCelula = 0;
          }
          cubTotalizador += (percentualCelula / 100) * cubCelula;
          // += percentual grupo / 100 * cub grupo
        }
      });
      this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo2].cub = cubTotalizador.toFixed(2);
    });
  }

  calcularPorcentualTotalizador() {
    let porcentualTotalizador:number = 0;
    this.servicos.forEach(servico => {
      porcentualTotalizador = 0;
      porcentualTotalizador += (this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo2].quantidade / this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo1].quantidade) * 100;
      // quantidade totalizador / quantidade valor base
      this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo2].percentual = porcentualTotalizador.toFixed(2);
    });
  }

  private decimalMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 2,
    integerLimit: null,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false
  });

  inputMatrizChange(event, obj, propriedadeObj) {
    // console.log(event.target.value);
    obj[propriedadeObj] = (event.target.value).replace('.', '').replace(',', '.');
    // console.log(this.matriz);
    this.calcularTotais();
  }

  arrayCoresEscalaVermelhoAmareloVerde = [
    "#F8696B",
    "#F86A6B",
    "#F86D6B",
    "#F86E6C",
    "#F86F6C",
    "#F8716C",
    "#F8726C",
    "#F8736D",
    "#F8756D",
    "#F8766D",
    "#F8786D",
    "#F8796E",
    "#F87A6E",
    "#F97C6E",
    "#F97D6E",
    "#F97E6F",
    "#F9806F",
    "#F9816F",
    "#F98370",
    "#F98470",
    "#F98570",
    "#F98770",
    "#F98871",
    "#F98971",
    "#F98B71",
    "#F98C71",
    "#F98D72",
    "#FA8F72",
    "#FA9072",
    "#FA9272",
    "#FA9373",
    "#FA9473",
    "#FA9673",
    "#FA9773",
    "#FA9874",
    "#FA9A74",
    "#FA9B74",
    "#FA9D75",
    "#FA9E75",
    "#FA9F75",
    "#FBA175",
    "#FBA276",
    "#FBA376",
    "#FBA576",
    "#FBA676",
    "#FBA777",
    "#FBA977",
    "#FBAA77",
    "#FBAC77",
    "#FBAD78",
    "#FBAE78",
    "#FBB078",
    "#FBB178",
    "#FBB279",
    "#FCB479",
    "#FCB579",
    "#FCB77A",
    "#FCB87A",
    "#FCB97A",
    "#FCBB7A",
    "#FCBC7B",
    "#FCBD7B",
    "#FCBF7B",
    "#FCC07B",
    "#FCC17C",
    "#FCC37C",
    "#FCC47C",
    "#FDC67C",
    "#FDC77D",
    "#FDC87D",
    "#FDCA7D",
    "#FDCB7D",
    "#FDCC7E",
    "#FDCE7E",
    "#FDCF7E",
    "#FDD17F",
    "#FDD27F",
    "#FDD37F",
    "#FDD57F",
    "#FDD680",
    "#FDD780",
    "#FED980",
    "#FEDA80",
    "#FEDB81",
    "#FEDD81",
    "#FEDE81",
    "#FEE081",
    "#FEE182",
    "#FEE282",
    "#FEE482",
    "#FEE582",
    "#FEE683",
    "#FEE883",
    "#FEE983",
    "#FFEB84",
    "#E0E383",
    "#C1DA81",
    "#A2D07F",
    "#83C77D",
    "#63BE7B"
  ];

  setPercentualStyles(indexMatriz) {
    let styles = {
      'background-color': this.getCor(this.matriz[indexMatriz].percentual)
    };
    return styles;
  }

  getCor(percentual) {
    if (percentual) {
      if (percentual > 100)
        return this.arrayCoresEscalaVermelhoAmareloVerde[99];
      else if (percentual > 0)
        return this.arrayCoresEscalaVermelhoAmareloVerde[Math.trunc(percentual)-1];
      else
        return this.arrayCoresEscalaVermelhoAmareloVerde[0];
    }
    return null;
  }

  salvar() {
  }

}
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MessageService } from 'primeng/api';
import { LancamentoService } from 'app/lancamentos/lancamento.service';
import { ServicoService } from 'app/servicos/servico.service';
import { GrupoService } from 'app/grupos/grupo.service';
import { Servico, Grupo, Lancamento, LancamentoId, Medicao } from 'app/core/model';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

// import * as $ from 'jquery';
import { AuthService } from 'app/seguranca/auth.service';
import { Util } from 'app/core/util';
import { TipoGrupoEnum } from 'app/core/enum';
import { MedicaoService } from 'app/medicoes/medicao.service';

@Component({
  selector: 'app-medicao-cadastro',
  templateUrl: './medicao-cadastro.component.html',
  styleUrls: ['./medicao-cadastro.component.scss']
})
export class MedicaoCadastroComponent implements OnInit {

  tipoGrupoEnum = TipoGrupoEnum;

  medicao = new Medicao();

  idGrupoComTipoGrupo1 = null;
  idGrupoComTipoGrupo2 = null;

  servicos = null;
  grupos = null;
  lancamentos = null;

  matriz = {};

  usuarioLogadoContemRoleAdministrarMedicao = false;

  cubTotalGeral = 0;
  cubSubTotalGeral = 0;
  percentualSubTotalGeral = 0;

  constructor(
    public auth: AuthService,
    private medicaoService: MedicaoService,
    private servicoService: ServicoService,
    private grupoService: GrupoService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public title: Title
  ) { }

  ngOnInit() {    
    const idMedicao = this.route.snapshot.params['id'];
    if (idMedicao) {
      this.title.setTitle('Edição de Medição');
      this.usuarioLogadoContemRoleAdministrarMedicao = this.auth.temPermissao('ROLE_ADMINISTRAR_MEDICAO');
      this.carregarMedicao(idMedicao);
      this.carregarServicos(idMedicao);
      this.carregarGrupos(idMedicao);
      this.carregarLancamentos(idMedicao);
    }

    /*
    $(document).ready(function() {
      // Disable scroll when focused on a number input.
      $('body').on('focus', 'input[type=number]', function(e) {
        $(this).on('wheel', function(e) {
            e.preventDefault();
        });
      });

      // Restore scroll on number inputs.
      $('body').on('blur', 'input[type=number]', function(e) {
          $(this).off('wheel');
      });

      // Disable up and down keys.
      $('body').on('keydown', 'input[type=number]', function(e) {
          if ( e.which == 38 || e.which == 40 )
              e.preventDefault();
      });
    });
    */
  }

  carregarMedicao(id: number) {
    this.medicaoService.buscarPorId(id)
      .then(medicao => {
        this.medicao = medicao;
      })
      .catch(erro => this.errorHandler.handle(erro));
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

  getLancamento(servico:Servico, grupo:Grupo):Lancamento {
    for (let i = 0; i < this.lancamentos.length; i++) {
      const lancamentoI = this.lancamentos[i];
      if (lancamentoI.id.idGrupo == grupo.id && lancamentoI.id.idServico == servico.id) {
        // console.log(lancamentoI.quantidade + " - " + lancamentoI.cub + " - " + lancamentoI.percentual + " > " + servico.nome + " - " + grupo.nome);
        return lancamentoI;
      }
    }
    // console.log("NULL > " + servico.nome + " - " + grupo.nome);
    let lancamento:Lancamento = new Lancamento();
    lancamento.quantidade = null;
    lancamento.cub = null;
    lancamento.percentual = null;
    return lancamento;
  }

  isGrupoSistema(grupo): Boolean {
    return grupo.tipoGrupo.id == TipoGrupoEnum.TOTAL || grupo.tipoGrupo.id == TipoGrupoEnum.SUBTOTAL;
  }

  calcularTotais() {
    this.somarQuantidades();
    this.calcularCubGrupos();
    this.calcularQuantidadeTotalizador();
    this.calcularCubTotalizador();
    this.calcularPorcentualTotalizador();
    this.calcularTotalizadorGeral();
  }

  somarQuantidades() {
    let quantidadeBase:number;
    // let i = 0;
    // console.log("quantidade de serviços: " + this.servicos.length);
    this.servicos.forEach(servico => {
      quantidadeBase = 0;
      // i++;
      this.grupos.forEach(grupo => {
        if (!this.isGrupoSistema(grupo)) {
          let quantidade = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade;
          if (quantidade == null) {
            quantidade = 0;
          }
          quantidadeBase += quantidade;
        }
      });
      // console.log(i + " - quantidadeBase: " + quantidadeBase);
      this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo1].quantidade=quantidadeBase;
    });
  }

  calcularCubGrupos() {
    let cubGrupo:number = 0;
    this.servicos.forEach(servico => {
      this.grupos.forEach(grupo => {
        if (!this.isGrupoSistema(grupo)) {
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
          // console.log("quantidadeCelula: " + quantidadeCelula + " - quantidadeGrupoComTipoGrupo1: " + quantidadeGrupoComTipoGrupo1 + " - cubGrupoComTipoGrupo1: " + cubGrupoComTipoGrupo1);
          cubGrupo = ((quantidadeCelula / quantidadeGrupoComTipoGrupo1) || 0) * cubGrupoComTipoGrupo1;
          // quantidade subsolo / quantidade geral * cub geral
          // console.log("cub: " + cubGrupo.toFixed(2));
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
        if (!this.isGrupoSistema(grupo)) {
          let percentualCelula = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].percentual;
          if (percentualCelula == null) {
            percentualCelula = 0;
          }
          let quantidadeCelula = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade;
          if (quantidadeCelula == null) {
            quantidadeCelula = 0;
          }
          // console.log("percentualCelula: " + percentualCelula + " - quantidadeCelula: " + quantidadeCelula);
          quantidadeTotalizador += (percentualCelula / 100) * quantidadeCelula;
          // += percentual grupo / 100 * quantidade grupo
        }
      });
      this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo2].quantidade = quantidadeTotalizador.toFixed(2);
    });
  }

  calcularCubTotalizador() {
    let cubTotalizador:number;
    this.servicos.forEach(servico => {
      cubTotalizador = 0;
      this.grupos.forEach(grupo => {
        if (!this.isGrupoSistema(grupo)) {
          let percentualCelula = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].percentual;
          if (percentualCelula == null) {
            percentualCelula = 0;
          }
          let cubCelula = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].cub;
          if (cubCelula == null) {
            cubCelula = 0;
          }
          cubTotalizador += (percentualCelula / 100) * cubCelula;
          // console.log("percentualCelula: " + percentualCelula + " - cubCelula: " + cubCelula);
          // console.log((percentualCelula / 100) * cubCelula);
          // += percentual grupo / 100 * cub grupo
        }
      });
      this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo2].cub = cubTotalizador.toFixed(2);
    });
  }

  calcularPorcentualTotalizador() {
    let porcentualTotalizador:number;
    this.servicos.forEach(servico => {
      porcentualTotalizador = 0;
      let quantidadeIdGrupoComTipoGrupo2 = this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo2].quantidade;
      if (quantidadeIdGrupoComTipoGrupo2 == null) {
        quantidadeIdGrupoComTipoGrupo2 = 0;
      }
      let quantidadeIdGrupoComTipoGrupo1 = this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo1].quantidade;
      if (quantidadeIdGrupoComTipoGrupo1 == null) {
        quantidadeIdGrupoComTipoGrupo1 = 0;
      }
      // console.log("quantidadeIdGrupoComTipoGrupo2: " + quantidadeIdGrupoComTipoGrupo2 + " - quantidadeIdGrupoComTipoGrupo1: " + quantidadeIdGrupoComTipoGrupo1);
      porcentualTotalizador += ((quantidadeIdGrupoComTipoGrupo2 / quantidadeIdGrupoComTipoGrupo1) || 0) * 100;
      // quantidade totalizador / quantidade valor base
      this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo2].percentual = porcentualTotalizador.toFixed(2);
    });
  }

  calcularTotalizadorGeral() {
    this.cubTotalGeral = 0;
    this.cubSubTotalGeral = 0;
    this.servicos.forEach(servico => {
      // console.log(servico.nome + ": " + this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo1].cub);
      this.cubTotalGeral += parseFloat((this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo1].cub || 0));
      // console.log(servico.nome + ": " + this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo2].cub);
      this.cubSubTotalGeral += parseFloat(this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo2].cub);
    });
    // console.log("cubSubTotalGeral: " + this.cubSubTotalGeral + "- cubTotalGeral: " + this.cubTotalGeral); // arrumar
    this.percentualSubTotalGeral = (this.cubSubTotalGeral * 100) / this.cubTotalGeral;
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
    obj[propriedadeObj] = parseFloat((event.target.value).replace('.', '').replace(',', '.'));
    // console.log(this.matriz);
    this.calcularTotais();
  }

  setPercentualStylesByIndex(indexMatriz) {
    let percentual = this.matriz[indexMatriz] ? this.matriz[indexMatriz].percentual : null;
    let styles = {
      'background-color': Util.getCorEscalaVermelhoAmareloVerdeByPercentual(percentual)
    };
    return styles;
  }

  setPercentualStylesByValue(value) {
    let styles = {
      'background-color': Util.getCorEscalaVermelhoAmareloVerdeByPercentual(value)
    };
    return styles;
  }

  salvar() {
    let lancamentos = new Array();
    let lancamento:Lancamento;
    this.grupos.forEach(grupo => {
      this.servicos.forEach(servico => {
        lancamento = new Lancamento();
        lancamento.id = new LancamentoId();
        lancamento.id.idGrupo = grupo.id;
        lancamento.id.idServico = servico.id;
        lancamento.id.idMedicao = this.medicao.id;
        lancamento.quantidade = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade;
        lancamento.cub = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].cub;
        lancamento.percentual = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].percentual;
        lancamentos.push(lancamento);
      });
    });
    this.lancamentoService.salvar(lancamentos)
      .then(lancamentosAdicionados => {
        this.messageService.add({ severity: 'success', detail: 'Matriz salva com sucesso!' });
        // this.router.navigate(['/medicoes', this.idMedicao]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvarComo() {
    console.log('salvar como click');
  }

  renomear() {
    console.log('renomear click');
  }

}
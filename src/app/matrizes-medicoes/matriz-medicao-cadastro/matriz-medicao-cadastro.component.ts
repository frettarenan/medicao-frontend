import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MessageService } from 'primeng/api';
import { LancamentoService } from 'app/lancamentos/lancamento.service';
import { ServicoService } from 'app/servicos/servico.service';
import { GrupoService } from 'app/grupos/grupo.service';
import { Servico, Grupo, Lancamento, LancamentoId } from 'app/core/model';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

// import * as $ from 'jquery';
import { AuthService } from 'app/seguranca/auth.service';
import { Util } from 'app/core/util';
import { TipoGrupoEnum } from 'app/core/enum';

@Component({
  selector: 'app-matriz-medicao-cadastro',
  templateUrl: './matriz-medicao-cadastro.component.html',
  styleUrls: ['./matriz-medicao-cadastro.component.scss']
})
export class MatrizMedicaoCadastroComponent implements OnInit {

  tipoGrupoEnum = TipoGrupoEnum;

  processando = true;

  idMedicao;

  idGrupoComTipoGrupo1 = null;
  idGrupoComTipoGrupo2 = null;

  servicos = null;
  grupos = null;
  lancamentos = null;

  matriz = null;

  usuarioLogadoContemRoleAdministrarMatrizMedicao = false;

  cubTotalGeral = 0;
  cubSubTotalGeral = 0;
  percentualSubTotalGeral = 0;

  constructor(
    public auth: AuthService,
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
    this.idMedicao = this.route.snapshot.params['id'];

    this.title.setTitle('Edição de Matriz de Medição');

    if (this.idMedicao) {
      this.usuarioLogadoContemRoleAdministrarMatrizMedicao = this.auth.temPermissao('ROLE_ADMINISTRAR_MATRIZ_MEDICAO');
      this.carregarServicos(this.idMedicao);
      this.carregarGrupos(this.idMedicao);
      this.carregarLancamentos(this.idMedicao);
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

  isGrupoSistema(grupo): Boolean {
    return grupo.tipoGrupo.id == TipoGrupoEnum.TOTAL || grupo.tipoGrupo.id == TipoGrupoEnum.SUB_TOTAL;
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
    let quantidadeBase:number = 0;
    this.servicos.forEach(servico => {
      quantidadeBase = 0;
      this.grupos.forEach(grupo => {
        if (!this.isGrupoSistema(grupo)) {
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
        if (!this.isGrupoSistema(grupo)) {
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

  calcularTotalizadorGeral() {
    this.cubTotalGeral = 0;
    this.cubSubTotalGeral = 0;
    this.servicos.forEach(servico => {
      this.cubTotalGeral += parseFloat(this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo1].cub);
      this.cubSubTotalGeral += parseFloat(this.matriz["idServico" + servico.id + "idGrupo" + this.idGrupoComTipoGrupo2].cub);
    });
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
    let styles = {
      'background-color': Util.getCorEscalaVermelhoAmareloVerdeByPercentual(this.matriz[indexMatriz].percentual)
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
        lancamento.id.idMedicao = this.idMedicao;
        lancamento.quantidade = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].quantidade;
        lancamento.cub = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].cub;
        lancamento.percentual = this.matriz["idServico" + servico.id + "idGrupo" + grupo.id].percentual;
        lancamentos.push(lancamento);
      });
    });
    this.lancamentoService.salvar(lancamentos)
      .then(lancamentosAdicionados => {
        this.messageService.add({ severity: 'success', detail: 'Lançamentos salvos com sucesso!' });
        // this.router.navigate(['/matrizes-medicoes', this.idMedicao]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
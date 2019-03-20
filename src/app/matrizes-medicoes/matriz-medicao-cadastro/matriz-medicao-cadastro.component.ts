import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matriz-medicao-cadastro',
  templateUrl: './matriz-medicao-cadastro.component.html',
  styleUrls: ['./matriz-medicao-cadastro.component.css']
})
export class MatrizMedicaoCadastroComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  servicos = [
    {codServico: 1, nomeServico: 'MO Cortina de contenção'},
    {codServico: 2, nomeServico: 'MO Blocos de fundação e vigas baldrame'},
    {codServico: 3, nomeServico: 'MO Recuperação de cubetas'}
  ];
  grupos = [
    {codGrupo: -1, nomeGrupo: 'TOTAL DO CONTRATO'},
    {codGrupo: 1, nomeGrupo: 'SUBSOLO'},
    {codGrupo: 2, nomeGrupo: 'TÉRREO'},
    {codGrupo: -2, nomeGrupo: 'SUBTOTAL'}
  ];
  matriz = {
    "codServico1codGrupo-1": {quantidade: null, cub: 71.55},
    "codServico1codGrupo1": {quantidade:447.31, cub: null, porcentagem: 100},
    "codServico1codGrupo2": {quantidade:111.83, cub: null, porcentagem: 75},
    "codServico1codGrupo-2": {quantidade: null, cub: null, porcentagem: null},

    "codServico2codGrupo-1": {quantidade: null, cub: 162.50},
    "codServico2codGrupo1": {quantidade: 1201.17, cub: null, porcentagem: 100},
    "codServico2codGrupo2": {quantidade: 133.46, cub: null, porcentagem: 60},
    "codServico2codGrupo-2": {quantidade: null, cub: null, porcentagem: null},

    "codServico3codGrupo-1": {quantidade: null, cub: 15.71},
    "codServico3codGrupo1": {quantidade:938.75, cub: null, porcentagem: 100},
    "codServico3codGrupo2": {quantidade:150, cub: null, porcentagem: 0},
    "codServico3codGrupo-2": {quantidade: null, cub: null, porcentagem: null}
  };

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
        if (grupo.codGrupo > 0) {
          quantidadeBase += this.matriz["codServico" + servico.codServico + "codGrupo" + grupo.codGrupo].quantidade;
        }
      });
      this.matriz["codServico" + servico.codServico + "codGrupo-1"].quantidade=quantidadeBase;
    });
  }

  calcularCubGrupos() {
    let cubGrupo:number = 0;
    this.servicos.forEach(servico => {
      this.grupos.forEach(grupo => {
        if (grupo.codGrupo > 0) {
          //alert(this.matriz["codServico" + servico.codServico + "codGrupo" + grupo.codGrupo].quantidade + "/" + this.matriz["codServico" + servico.codServico + "codGrupo-1"].quantidade + "*" + this.matriz["codServico" + servico.codServico + "codGrupo-1"].cub);
          cubGrupo = this.matriz["codServico" + servico.codServico + "codGrupo" + grupo.codGrupo].quantidade / this.matriz["codServico" + servico.codServico + "codGrupo-1"].quantidade * this.matriz["codServico" + servico.codServico + "codGrupo-1"].cub;
          // quantidade subsolo / quantidade geral * cub geral
          this.matriz["codServico" + servico.codServico + "codGrupo" + grupo.codGrupo].cub = cubGrupo.toFixed(2);
        }
      });
    });
  }

  calcularQuantidadeTotalizador() {
    let quantidadeTotalizador:number = 0;
    this.servicos.forEach(servico => {
      quantidadeTotalizador = 0;
      this.grupos.forEach(grupo => {
        if (grupo.codGrupo > 0) {
          quantidadeTotalizador += (this.matriz["codServico" + servico.codServico + "codGrupo" + grupo.codGrupo].porcentagem / 100) * this.matriz["codServico" + servico.codServico + "codGrupo" + grupo.codGrupo].quantidade;
          // += percentual grupo / 100 * quantidade grupo
        }
      });
      this.matriz["codServico" + servico.codServico + "codGrupo-2"].quantidade = quantidadeTotalizador.toFixed(2);
    });
  }

  calcularCubTotalizador() {
    let cubTotalizador:number = 0;
    this.servicos.forEach(servico => {
      cubTotalizador = 0;
      this.grupos.forEach(grupo => {
        if (grupo.codGrupo > 0) {
          cubTotalizador += (this.matriz["codServico" + servico.codServico + "codGrupo" + grupo.codGrupo].porcentagem / 100) * this.matriz["codServico" + servico.codServico + "codGrupo" + grupo.codGrupo].cub;
          // += percentual grupo / 100 * cub grupo
        }
      });
      this.matriz["codServico" + servico.codServico + "codGrupo-2"].cub = cubTotalizador.toFixed(2);
    });
  }

  calcularPorcentualTotalizador() {
    let porcentualTotalizador:number = 0;
    this.servicos.forEach(servico => {
      porcentualTotalizador = 0;
      porcentualTotalizador += (this.matriz["codServico" + servico.codServico + "codGrupo-2"].quantidade / this.matriz["codServico" + servico.codServico + "codGrupo-1"].quantidade) * 100;
      // quantidade totalizador / quantidade valor base
      this.matriz["codServico" + servico.codServico + "codGrupo-2"].porcentagem = porcentualTotalizador.toFixed(2);
    });
  }

}

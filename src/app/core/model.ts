export class Estado {
  id: number;
  nome: string;
}

export class Cidade {
  id: number;
  nome: string;
  estado = new Estado();
}

export class Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade = new Cidade();
}

export class Contato {
  id: number;
  nome: string;
  email: string;
  telefone: string;

  constructor(id?: number,
    nome?: string,
    email?: string,
    telefone?: string) {
      this.id = id;
      this.nome = nome;
      this.email = email;
      this.telefone = telefone;
  }
}

export class Construtora {
  id: number;
  razaoSocial: string;
  cnpj : string;
  ativo = true;
}

export class Obra {
  id: number;
  nome: string;
  construtora : Construtora;
  usuarioResponsavel : Usuario;
  ativo = true;
}

export class Grupo {
  id: number;
  nome: string;
  obra : Obra;
  grupoPai : Grupo;
}

export class GrupoHierarquia {
  id: number;
  nome: string;
  children : Array<GrupoHierarquia>;
}

export class Contrato {
  id: number;
  numero: string;
  descricao: string;
  obra : Obra;
}

export class Servico {
  id: number;
  nome: string;
  contrato : Contrato;
}

export class Medicao {
  id: number;
  nome: string;
  contrato : Contrato;
}

export class Lancamento {
  id : LancamentoId;
  grupo: Grupo;
  servico: Servico;
  medicao: Medicao;
  quantidade: number;
  cub: number;
  percentual: number;
}

export class LancamentoId {
  idGrupo : number;
  idServico : number;
  idMedicao : number;
}

export class Usuario {
  id: number;
  nome: string;
  construtora = new Construtora();
  telefone : string;
  email : string;
  senha : string;
  ativo = true;
  administrador = false;
}

export class Pessoa {
  id: number;
  nome: string;
  endereco = new Endereco();
  ativo = true;
  contatos = new Array<Contato>();
}

export class Categoria {
  id: number;
}

/*export class Lancamento {
  id: number;
  tipo = 'RECEITA';
  descricao: string;
  dataVencimento: Date;
  dataPagamento: Date;
  valor: number;
  observacao: string;
  pessoa = new Pessoa();
  categoria = new Categoria();
  anexo: string;
  urlAnexo: string;
}*/
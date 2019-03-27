import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Obra } from 'app/core/model';
import { FormControl } from '@angular/forms';
import { AuthService } from 'app/seguranca/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MessageService } from 'primeng/api';
import { ObraService } from '../obra.service';

@Component({
  selector: 'app-obra-cadastro',
  templateUrl: './obra-cadastro.component.html',
  styleUrls: ['./obra-cadastro.component.scss']
})
export class ObraCadastroComponent implements OnInit {

  obra = new Obra();

  constructor(
    public auth: AuthService,
    private obraService: ObraService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public title: Title
  ) { }

  ngOnInit() {
    const idObra = this.route.snapshot.params['id'];
    if (idObra) {
      this.title.setTitle('Edição de Obra');
      this.carregarObra(idObra);
    } else {
      this.title.setTitle('Nova Obra');
    }
  }

  carregarObra(id: number) {
    this.obraService.buscarPorId(id)
      .then(obra => {
        this.obra = obra;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
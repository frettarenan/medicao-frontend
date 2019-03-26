import { Component, OnInit } from '@angular/core';

@Component({
  template: `
  <div class="container-full">
    <h1 class="text-center">Acesso negado!</h1>
  </div>
  `,
})
export class NaoAutorizadoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

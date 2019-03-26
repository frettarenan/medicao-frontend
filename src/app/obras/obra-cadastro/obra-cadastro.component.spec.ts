import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObraCadastroComponent } from './obra-cadastro.component';

describe('ObraCadastroComponent', () => {
  let component: ObraCadastroComponent;
  let fixture: ComponentFixture<ObraCadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObraCadastroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObraCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

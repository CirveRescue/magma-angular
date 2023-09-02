import { Component, ViewChild } from '@angular/core';
import { FacturacionServiceService } from 'src/assets/Facturacion-service/facturacion-service.service';
import { ShowErrorService } from './show-error/show-error.service';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'magma-angular';
    datosFacturacion: any = {};
    captchaToken!: string;
    captchaResuelto: boolean= false;
    contactoFormSubmitted: boolean = false;
    campoInvalido = {
    nombre: false,
    email: false,
    message: false,
  };

  @ViewChild('contacto', { static: true }) contactoForm!: NgForm;

  constructor(private facturaService: FacturacionServiceService, private _showservice: ShowErrorService, private _fb: FormBuilder, private router: Router,) {}

  ngOnInit() {

    this.datosFacturacion = this._fb.group({
      nombre: [null, Validators.required],
      email: [null, Validators.email],
      message: [null, Validators.required],

    });
  }
  onSubmit() {
    if (this.captchaResuelto && !this.datosFacturacion.invalid) {
      this._showservice.showLoading()
      this.facturaService
        .enviarDatosFacturacion(this.datosFacturacion, this.captchaToken)
        .then(
          (response) => {
            this._showservice.hideLoading()
            this._showservice.success("Correo enviado correctamente.")
            setTimeout(() => {
              window.location.reload()
            }, 1000);
          },
          (error) => {
            this._showservice.hideLoading()
            this._showservice.statusCode(error)
            setTimeout(() => {
              window.location.reload()
            }, 1000);
          }
        );
    }
    else
    {
      this._showservice.nosuccess("Porfavor revisa que el capo de Email(ejemplo@correo.com)")
    }
  }

  onHcaptchaSubmit(event: any) {
    this.captchaResuelto = true;
    this.captchaToken = event;
  }
}

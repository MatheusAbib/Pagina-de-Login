import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-address-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './address-modal.component.html',
  styleUrl: './address-modal.component.scss'
})
export class AddressModalComponent implements OnInit {
  @Input() address: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  isLoading = false;
  addressForm: FormGroup;

  constructor(private toastService: ToastrService) {
    this.addressForm = new FormGroup({
      endereco_entrega: new FormControl('', [Validators.required]),
      numero: new FormControl('', [Validators.required]),
      bairro: new FormControl('', [Validators.required]),
      cep: new FormControl('', [Validators.required]),
      cidade: new FormControl('', [Validators.required]),
      estado: new FormControl('', [Validators.required]),
      pais: new FormControl('Brasil', [Validators.required]),
      tipo_residencia: new FormControl(''),
      descricao_endereco: new FormControl('')
    });
  }

  ngOnInit() {
    if (this.address) {
      this.addressForm.patchValue(this.address);
    }
  }

  searchCep(event: any) {
    const target = event?.target || event;
    const value = target?.value || '';
    const cep = value.replace(/\D/g, '');

    if (cep.length !== 8) {
      this.toastService.error('CEP invalido! Digite 8 numeros.');
      return;
    }

    this.isLoading = true;
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if (data.erro) {
          this.toastService.error('CEP nao encontrado!');
          this.isLoading = false;
          return;
        }
        this.addressForm.patchValue({
          endereco_entrega: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
          cep: data.cep || ''
        });
        this.toastService.success('Endereco encontrado!');
        this.isLoading = false;
      })
      .catch(() => {
        this.toastService.error('Erro ao buscar CEP!');
        this.isLoading = false;
      });
  }

  onSubmit() {
    if (this.addressForm.invalid) {
      this.toastService.error('Preencha todos os campos obrigatorios');
      return;
    }
    this.save.emit(this.addressForm.value);
  }

  onClose() {
    this.close.emit();
  }
}

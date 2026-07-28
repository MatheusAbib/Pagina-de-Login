import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-card-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './card-modal.component.html',
  styleUrl: './card-modal.component.scss'
})
export class CardModalComponent implements OnInit {
  @Input() card: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  isLoading = false;
  cardForm: FormGroup;

  constructor() {
    this.cardForm = new FormGroup({
      numero_cartao: new FormControl('', [Validators.required]),
      nome_cartao: new FormControl('', [Validators.required]),
      bandeira: new FormControl('', [Validators.required]),
      codigo_seguranca: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]),
      validade: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    if (this.card) {
      this.cardForm.patchValue(this.card);
    }
  }

  onSubmit() {
    if (this.cardForm.invalid) return;
    this.save.emit(this.cardForm.value);
  }

  onClose() {
    this.close.emit();
  }
}

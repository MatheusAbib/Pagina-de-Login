import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { ToastrService } from 'ngx-toastr';
import { AddressModalComponent } from '../../components/address-modal/address-modal.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, AddressModalComponent, ConfirmModalComponent, FooterComponent],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss'
})
export class AddressesComponent implements OnInit {
  addresses: any[] = [];
  isLoading = false;
  editingAddress: any = null;
  showAddressModal = false;
  showConfirmModal = false;
  deletingId: number | null = null;

  constructor(
    private router: Router,
    private addressService: AddressService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.addressService.getAddresses().subscribe({
      next: (data) => {
        this.addresses = data;
      },
      error: (error) => {
        this.toastService.error('Erro ao carregar endereços!');
        console.error(error);
      }
    });
  }

  openAddAddress() {
    this.editingAddress = null;
    this.showAddressModal = true;
  }

  openEditAddress(address: any) {
    this.editingAddress = address;
    this.showAddressModal = true;
  }

  closeAddressModal() {
    this.showAddressModal = false;
    this.editingAddress = null;
  }

  saveAddress(data: any) {
    this.isLoading = true;

    if (this.editingAddress) {
      this.addressService.updateAddress(this.editingAddress.id, data).subscribe({
        next: () => {
          this.toastService.success('Endereço atualizado com sucesso!');
          this.isLoading = false;
          this.closeAddressModal();
          this.loadAddresses();
        },
        error: (error) => {
          this.toastService.error('Erro ao atualizar endereço!');
          this.isLoading = false;
        }
      });
    } else {
      this.addressService.createAddress(data).subscribe({
        next: () => {
          this.toastService.success('Endereço adicionado com sucesso!');
          this.isLoading = false;
          this.closeAddressModal();
          this.loadAddresses();
        },
        error: (error) => {
          this.toastService.error('Erro ao adicionar endereço!');
          this.isLoading = false;
        }
      });
    }
  }

  confirmDelete(id: number) {
    this.deletingId = id;
    this.showConfirmModal = true;
  }

  deleteAddress() {
    if (this.deletingId) {
      this.addressService.deleteAddress(this.deletingId).subscribe({
        next: () => {
          this.toastService.success('Endereço excluído com sucesso!');
          this.showConfirmModal = false;
          this.deletingId = null;
          this.loadAddresses();
        },
        error: (error) => {
          this.toastService.error('Erro ao excluir endereço!');
          this.showConfirmModal = false;
        }
      });
    }
  }

  cancelDelete() {
    this.showConfirmModal = false;
    this.deletingId = null;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}

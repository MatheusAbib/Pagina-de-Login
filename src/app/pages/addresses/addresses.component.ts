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
    this.isLoading = true;
    this.addressService.getAddresses().subscribe({
      next: (data) => {
        this.addresses = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Erro ao carregar endere?os!');
        this.isLoading = false;
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
          this.toastService.success('Endere?o atualizado com sucesso!');
          this.isLoading = false;
          this.closeAddressModal();
          this.loadAddresses();
        },
        error: (error) => {
          this.toastService.error('Erro ao atualizar endere?o!');
          this.isLoading = false;
        }
      });
    } else {
      this.addressService.createAddress(data).subscribe({
        next: () => {
          this.toastService.success('Endere?o adicionado com sucesso!');
          this.isLoading = false;
          this.closeAddressModal();
          this.loadAddresses();
        },
        error: (error) => {
          this.toastService.error('Erro ao adicionar endere?o!');
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
      this.isLoading = true;
      this.addressService.deleteAddress(this.deletingId).subscribe({
        next: () => {
          this.toastService.success('Endere?o exclu?do com sucesso!');
          this.showConfirmModal = false;
          this.deletingId = null;
          this.isLoading = false;
          this.loadAddresses();
        },
        error: (error) => {
          this.toastService.error('Erro ao excluir endere?o!');
          this.showConfirmModal = false;
          this.isLoading = false;
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { AddressService } from '../../services/address.service';
import { CardService } from '../../services/card.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { PhotoModalComponent } from '../../components/photo-modal/photo-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ConfirmModalComponent,
    FooterComponent,
    PhotoModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: any;
  addresses: any[] = [];
  cards: any[] = [];
  showConfirmModal = false;
  showPhotoModal = false;
  isLoading = false;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private addressService: AddressService,
    private cardService: CardService,
    private router: Router,
    private toastService: ToastrService
  ) {
    this.user = this.loginService.getUser();
  }

  ngOnInit() {
    this.loadAddresses();
    this.loadCards();
  }

  loadAddresses() {
    this.addressService.getAddresses().subscribe({
      next: (data) => {
        this.addresses = data;
      },
      error: () => {}
    });
  }

  loadCards() {
    this.cardService.getCards().subscribe({
      next: (data) => {
        this.cards = data;
      },
      error: () => {}
    });
  }

  openProfile() {
    this.router.navigate(['/profile']);
  }

  openPhotoModal() {
    this.showPhotoModal = true;
  }

  closePhotoModal() {
    this.showPhotoModal = false;
  }

  savePhoto(photo: string) {
    this.isLoading = true;
    this.userService.updateProfilePhoto(photo).subscribe({
      next: (response) => {
        this.user = response.user;
        this.loginService.updateUser(this.user);
        this.toastService.success('Foto atualizada com sucesso!');
        this.closePhotoModal();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Erro ao salvar foto!');
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  logout() {
    this.showConfirmModal = true;
  }

  confirmLogout() {
    this.showConfirmModal = false;
    this.loginService.logout();
    this.toastService.success('Você saiu com sucesso!');
    this.router.navigate(['/login']);
  }

  cancelLogout() {
    this.showConfirmModal = false;
  }
}

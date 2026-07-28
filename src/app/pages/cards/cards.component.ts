import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardService } from '../../services/card.service';
import { ToastrService } from 'ngx-toastr';
import { CardModalComponent } from '../../components/card-modal/card-modal.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CardNumberPipe } from '../../pipes/card-number.pipe';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, CardModalComponent, ConfirmModalComponent, FooterComponent, CardNumberPipe],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {

  cards: any[] = [];
  isLoading = false;
  editingCard: any = null;
  showCardModal = false;
  showConfirmModal = false;
  deletingId: number | null = null;

  constructor(
    private router: Router,
    private cardService: CardService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.loadCards();
  }

  loadCards() {
    this.cardService.getCards().subscribe({
      next: (data) => {
        this.cards = data;
        console.log('Cartões carregados:', this.cards);
      },
      error: (error) => {
        this.toastService.error('Erro ao carregar cartões!');
        console.error(error);
      }
    });
  }

  openAddCard() {
    this.editingCard = null;
    this.showCardModal = true;
  }

  openEditCard(card: any) {
    this.editingCard = card;
    this.showCardModal = true;
  }

  closeCardModal() {
    this.showCardModal = false;
    this.editingCard = null;
  }

  saveCard(data: any) {
    this.isLoading = true;

    if (this.editingCard) {
      this.cardService.updateCard(this.editingCard.id, data).subscribe({
        next: () => {
          this.toastService.success('Cartão atualizado com sucesso!');
          this.isLoading = false;
          this.closeCardModal();
          this.loadCards();
        },
        error: (error) => {
          this.toastService.error('Erro ao atualizar cartão!');
          this.isLoading = false;
        }
      });
    } else {
      this.cardService.createCard(data).subscribe({
        next: () => {
          this.toastService.success('Cartão adicionado com sucesso!');
          this.isLoading = false;
          this.closeCardModal();
          this.loadCards();
        },
        error: (error) => {
          this.toastService.error('Erro ao adicionar cartão!');
          this.isLoading = false;
        }
      });
    }
  }

  confirmDelete(id: number) {
    this.deletingId = id;
    this.showConfirmModal = true;
  }

  deleteCard() {
    if (this.deletingId) {
      this.cardService.deleteCard(this.deletingId).subscribe({
        next: () => {
          this.toastService.success('Cartão excluído com sucesso!');
          this.showConfirmModal = false;
          this.deletingId = null;
          this.loadCards();
        },
        error: (error) => {
          this.toastService.error('Erro ao excluir cartão!');
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

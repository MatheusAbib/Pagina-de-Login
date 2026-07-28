import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-modal.component.html',
  styleUrl: './photo-modal.component.scss'
})
export class PhotoModalComponent implements OnInit {
  @Input() currentPhoto: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  imagePreview: string | null = null;
  originalPhoto: string | null = null;
  isLoading = false;

  zoom = 1;
  positionX = 0;
  positionY = 0;
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  startPosX = 0;
  startPosY = 0;

  ngOnInit() {
    if (this.currentPhoto) {
      this.imagePreview = this.currentPhoto;
      this.originalPhoto = this.currentPhoto;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.compressImage(e.target?.result as string, 800, 0.7);
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  compressImage(dataUrl: string, maxSize: number, quality: number) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', quality);
      this.imagePreview = compressed;
      this.originalPhoto = compressed;
      this.zoom = 1;
      this.positionX = 0;
      this.positionY = 0;
    };
    img.src = dataUrl;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  zoomIn() {
    if (this.zoom < 3) {
      this.zoom += 0.1;
    }
  }

  zoomOut() {
    if (this.zoom > 0.5) {
      this.zoom -= 0.1;
    }
  }

  resetZoom() {
    this.zoom = 1;
    this.positionX = 0;
    this.positionY = 0;
  }

  resetPhoto() {
    if (this.originalPhoto) {
      this.imagePreview = this.originalPhoto;
      this.zoom = 1;
      this.positionX = 0;
      this.positionY = 0;
    }
  }

  startDrag(event: MouseEvent) {
    if (!this.imagePreview) return;
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startPosX = this.positionX;
    this.startPosY = this.positionY;
    event.preventDefault();
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;
    this.positionX = this.startPosX + dx;
    this.positionY = this.startPosY + dy;
    event.preventDefault();
  }

  stopDrag() {
    this.isDragging = false;
  }

  onSave() {
    if (this.imagePreview) {
      this.isLoading = true;
      const photo = this.imagePreview;
      setTimeout(() => {
        this.save.emit(photo);
        this.isLoading = false;
      }, 800);
    }
  }

  onClose() {
    this.close.emit();
  }
}

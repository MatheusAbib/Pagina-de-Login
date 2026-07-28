import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  logo: string = '';

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.configService.getLogo().subscribe({
      next: (data) => {
        this.logo = data.logo;
        console.log('Logo carregada do banco!');
      },
      error: (err) => {
        console.error('Erro ao carregar logo:', err);
      }
    });
  }
}

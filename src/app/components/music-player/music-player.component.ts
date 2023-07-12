import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { dtoMusic } from 'src/app/interfaces/Music';
import { MusicService } from 'src/app/services/music.service';
import { HttpErrorResponse } from '@angular/common/http';
import { VideoService } from 'src/app/services/video.service';
@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css'],
})
export class MusicPlayerComponent implements OnInit {
  src: String;
  listMusic: dtoMusic[] = [];

  addMusic: FormGroup;
  dtoMusic: dtoMusic | undefined;

  selectedVideoId: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _videoService: VideoService,
    private _musicService: MusicService,
    private toastr: ToastrService
  ) {
    this.addMusic = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      url: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getMusic();
  }
  //-------------------------------------------------------------------------LISTAR MUSICA
  getMusic() {
    console.log('askjxhsaijdhsajdk');
    this._musicService.getListMusic().subscribe(
      (data) => {
        this.listMusic = data.result;
        console.log(this.listMusic);
      },
      (error) => {
        this.toastr.error('Opss ocurrio un error', 'Error');
        console.log(error);
      }
    );
  }
  //-------------------------------------------------------------------------ELIMINAR MUSICA
  deleteMusic(videoId: any | undefined) {
    if (videoId) {
      this.selectedVideoId = videoId;
    }
    // Traer video
    this._videoService.getVideo(this.selectedVideoId).subscribe((data) => {
      this.listMusic = data.result;
      const videoJSON = {
        name: data.result.name,
        description: data.result.description,
        url: data.result.url,
        state: false,
      };
      console.log(videoJSON);
      // Enviar el resultado al servicio de música
      this._videoService.updateVideo(videoId, videoJSON).subscribe();
    });
    this._musicService.deleteMusic(videoId).subscribe(
      (data) => {
        this.getMusic();
        this.toastr.error(
          'La música fue eliminado con exito',
          'Registro eliminado!'
        );
      },
      (error) => {
        this.toastr.error('Opss ocurrio un error', 'Error');
        console.log(error);
      }
    );
  }
  //-------------------------------------------------------------------------DESCARGAR MUSICA
  descargar(url: any) {
    this._musicService.descargarAudio(url);
  }

  //-------------------------------------------------------------------------REPRODUCIR VIDEO
  escuchar() {}
}

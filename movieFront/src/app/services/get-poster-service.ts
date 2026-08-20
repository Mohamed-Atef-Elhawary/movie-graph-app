import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GetPosterService {
  private posters: string[] = [
    'i1.png',
    'i2.png',
    'i3.png',
    'i4.png',
    'i5.webp',
    'i6.webp',
    'i7.webp',
    'i8.webp',
    'i9.webp',
    'i10.webp',
    'i11.webp',
    'i12.webp',
    'i13.webp',
    'i14.webp',
    'i15.webp',
    'i16.webp',
    'i17.webp',
    'i18.webp',
  ];
  hashStringToIndex(str: string, arrayLength: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + hash * 31;
    }
    return Math.abs(hash) % arrayLength;
  }

  getPoster(name: string): string {
    const index = this.hashStringToIndex(name, this.posters.length);
    return this.posters[index];
  }
}

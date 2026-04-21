import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'épp most';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} perce`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} órája`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} napja`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} hete`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} hónapja`;
    const years = Math.floor(days / 365);
    return `${years} éve`;
  }
}

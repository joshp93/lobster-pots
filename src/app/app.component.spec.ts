import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { GameplayService } from './services/gameplay.service';
import { ProgressService } from './services/progress.service';

describe('AppComponent', () => {
    beforeEach(async () => {
        sessionStorage.clear();
        await TestBed.configureTestingModule({
            imports: [AppComponent]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('renders the day-one setup, progress bar and panels', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const text = fixture.nativeElement.textContent as string;

        expect(text).toContain('Avast, Me Hearties!');
        expect(text).toContain('Lobsters Revenge');
        expect(text).toContain('Demand');
        expect(text).toContain('Boatyard');

        const premisesButton = Array.from(
            fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
        ).find((button) => button.textContent?.trim() === 'Premises');
        premisesButton?.click();
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Offers refresh in');
    });

    it('runs a day and shows results', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const progress = TestBed.inject(ProgressService);
        const gameplay = TestBed.inject(GameplayService);
        const boat = progress.boats.find((candidate) => candidate.damage < 100);

        if (boat) {
            gameplay.fillBoat(boat.id);
        }

        const button = fixture.nativeElement.querySelector('#lobster') as HTMLButtonElement;
        button.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Go To Next Day...');
    });
});

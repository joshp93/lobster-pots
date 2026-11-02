import { TestBed } from '@angular/core/testing';

import { ProgressService } from './progress.service';

describe('ProgressService', () => {
    let service: ProgressService;

    beforeEach(() => {
        sessionStorage.clear();
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProgressService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('notifies subscribers when state changes', () => {
        const before = service.revision();

        service.addToIncome(10);
        const afterIncome = service.revision();

        expect(afterIncome).toBeGreaterThan(before);

        service.boats = [...service.boats];

        expect(service.revision()).toBeGreaterThan(afterIncome);
    });
});

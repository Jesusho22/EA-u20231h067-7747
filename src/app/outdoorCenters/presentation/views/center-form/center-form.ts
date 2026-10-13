import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReservationStore} from '../../../../reservations/application/reservations.store';

@Component({
  selector: 'app-category-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './center-form.html',
  styleUrl: './center-form.css'
})
export class CenterForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(ReservationStore);

  form = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });

  isEdit = false;
  centerId: number | null = null;

  constructor() {
    this.route.params.subscribe(params => {
      this.centerId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.centerId;
      if (this.isEdit && this.centerId) {
        const id = this.centerId;
        const center = this.store.getCenterById(id)();
        if (this.centerId) {
          this.form.patchValue({ name: center.name });
        }
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const center: Center = new Center({
      id: this.centerId ?? 0,
      name: this.form.value.name!
    });

    if (this.isEdit) {
      this.store.updateCenter(this.centerId);
    } else {
      this.store.addCenter(this.centerId);
    }

    this.router.navigate(['outdoorCenter/centers']).then();
  }
}

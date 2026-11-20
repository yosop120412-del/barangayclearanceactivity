
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  clearanceForm: FormGroup;

  formStatus = 'INVALID';

  submitted = false;

  constructor(private fb: FormBuilder) {

    this.clearanceForm = this.fb.group({

      fullName: ['', Validators.required],

      birthdate: ['', Validators.required],

      address: ['', Validators.required],

      contactNumber: [
        '',
        [
          Validators.required,
          this.contactNumberValidator
        ]
      ],

      purpose: ['', Validators.required],

      otherPurpose: [{ value: '', disabled: true }]

    });

    // Listen for purpose changes
    this.clearanceForm.get('purpose')?.valueChanges.subscribe(value => {

      const otherControl = this.clearanceForm.get('otherPurpose');

      if (value === 'Others') {

        otherControl?.enable();
        otherControl?.setValidators(Validators.required);

      } else {

        otherControl?.clearValidators();
        otherControl?.reset();
        otherControl?.disable();

      }

      otherControl?.updateValueAndValidity();

    });

    // Listen for form status changes
    this.clearanceForm.statusChanges.subscribe(status => {

      this.formStatus = status;

    });

  }

  // Custom contact number validator
  contactNumberValidator(control: AbstractControl): ValidationErrors | null {

    const value = control.value;

    if (!value) {
      return null;
    }

    const valid = /^09\d{9}$/.test(value);

    return valid ? null : { invalidContactNumber: true };

  }

  // Live preview
  get formData() {

    return this.clearanceForm.getRawValue();

  }

  // Submit form
  onSubmit() {

    this.submitted = true;

    if (this.clearanceForm.valid) {

      alert('Barangay Clearance Request Submitted Successfully!');

      console.log(this.clearanceForm.getRawValue());

    } else {

      this.clearanceForm.markAllAsTouched();

    }

  }

}

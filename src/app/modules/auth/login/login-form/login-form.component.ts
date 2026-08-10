import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  loginTypeLabel: string = 'Portal Login';
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize reactive form with enterprise-level validations
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Extract dynamic login context from route data or parameters
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.loginTypeLabel = params['type'];
      }
    });
  }

  // Helper getters for easy form validation checks in HTML
  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { userId, password, rememberMe } = this.loginForm.value;

    // Simulate API authentication payload execution
    console.log(`Authenticating ${userId} for dynamic scope: ${this.loginTypeLabel}`);

    setTimeout(() => {
      this.isLoading = false;
      // Navigate to portal dashboard upon successful authentication
      // this.router.navigate(['/dashboard']);
    }, 1500);
  }
}
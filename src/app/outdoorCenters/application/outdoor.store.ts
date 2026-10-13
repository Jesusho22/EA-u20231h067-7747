import {computed, inject, Service, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

@Service()
export class OutdoorStore {
  private readonly outdoorService = inject(OutdoorService);

  readonly courseCount = computed(() => this.courses().length);

  readonly categoryCount = computed(() => this.categories().length);

  private readonly coursesSignal = signal<Course[]>([]);

  readonly courses = this.coursesSignal.asReadonly();

  private readonly categoriesSignal = signal<Category[]>([]);

  readonly categories = this.categoriesSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);

  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);

  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.loadCategories();
    this.loadCourses();
  }

  getCategoryById = (id: number): Signal<Category | undefined> =>
    computed(() => id ? this.categories().find(c => c.id === id) : undefined);


  getCourseById = (id: number): Signal<Center | undefined> => {
    return computed(() => id ? this.courses().find(c => c.id === id) : undefined);
  }

  addCourse = (center: Center): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.outdoorService.createCenter(center).pipe(retry(2)).subscribe({
      next: createdCenter => {
        createdCenter = this.assignCategoryToCenter(center);
        this.coursesSignal.update(courses => [...center, createdCenter]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create center'));
        this.loadingSignal.set(false);
      }
    });
  };

  updateCourse = (updatedCourse: Course): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.outdoorService.updateCourse(updatedCourse).pipe(retry(2)).subscribe({
      next: course => {
        course = this.assignCategoryToCourse(course);
        this.coursesSignal.update(courses =>
          courses.map(c => c.id === course.id ? course : c)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update course'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteCourse = (id: number): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.outdoorService.deleteCourse(id).pipe(retry(2)).subscribe({
      next: () => {
        this.coursesSignal.update(courses => courses.filter(c => c.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete course'));
        this.loadingSignal.set(false);
      }
    });
  }

  addCategory = (category: Category): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.outdoorService.createCategory(category).pipe(retry(2)).subscribe({
      next: createdCategory => {
        this.categoriesSignal.update(categories => [...categories, createdCategory]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create category'));
        this.loadingSignal.set(false);
      }
    });
  }
  updateCategory = (updatedCategory: Category): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.outdoorService.updateCategory(updatedCategory).pipe(retry(2)).subscribe({
      next: category => {
        this.categoriesSignal.update(categories =>
          categories.map(c => c.id === category.id ? category : c)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update category'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteCategory = (id: number): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.outdoorService.deleteCategory(id).pipe(retry(2)).subscribe({
      next: () => {
        this.categoriesSignal.update(categories => categories.filter(c => c.id !== id));
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete category'));
        this.loadingSignal.set(false);
      }
    });
  }
  private loadCourses = (): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.outdoorService.getCourses().pipe(takeUntilDestroyed()).subscribe({
      next: courses => {
        console.log(courses);
        this.coursesSignal.set(courses);
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
        this.assignCategoriesToCourses();


      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load courses'));
        this.loadingSignal.set(false);
      }
    });
  };

  private loadCategories = (): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.outdoorService.getCategories().pipe(takeUntilDestroyed()).subscribe({
      next: categories => {
        this.categoriesSignal.set(categories);
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load categories'));
        this.loadingSignal.set(false);
      }
    });
  }

  private assignCategoriesToCourses = (): void => {
    this.coursesSignal.update(courses => courses.map(course => this.assignCategoryToCourse(course)));
  };

  private assignCategoryToCourse = (center: Center): Center => {
    const categoryId = center.categoryId ?? 0;
    center.category = categoryId ? this.getCategoryById(categoryId)() ?? null : null;
    return center;
  }

  private formatError = (error: unknown, fallback: string): string => {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}

import {Component, computed, inject, viewChild} from '@angular/core';
import {OutdoorStore} from "../../../application/outdoor.store";
import {Router} from '@angular/router';
import {MatError} from '@angular/material/form-field';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-course-list',
  imports: [
    MatError,
    MatTable,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRowDef,
    MatRowDef,
    MatButton,
    MatHeaderRow,
    MatRow,
    MatProgressSpinner,
    MatIcon,
    MatIconButton,
    MatSort,
    MatSortHeader,
    MatPaginator
  ],
  templateUrl: './center-list.html',
  styleUrl: './center-list.css'
})
export class CenterList {
  readonly store = inject(OutdoorStore);
  protected router = inject(Router);

  displayedColumns: string[] = ['id', 'title', 'description', 'category', 'actions'];

  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  readonly dataSource = computed(() => {
    const source = new MatTableDataSource(this.store.courses());
    const sort = this.sort();
    if (sort) {
      source.sort = sort;
    }
    const paginator = this.paginator();
    if (paginator) {
      source.paginator = paginator;
    }
    return source;
  });

  editCenter(id: number) {
    this.router.navigate(['outdoorCenter/centers', id, 'edit']).then();
  }

  deleteCenter(id: number) {
    this.store.deleteCenter(id);
  }

  navigateToNew() {
    this.router.navigate(['outdoorCenter/centers/reservation']).then();
  }
}

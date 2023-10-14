import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificationCodePage } from './verification-code.page';

const routes: Routes = [
  {
    path: '',
    component: VerificationCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificationCodePageRoutingModule {}

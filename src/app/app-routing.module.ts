import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'signin',
    loadChildren: () =>
      import(`./pages/signin/signin.module`).then((m) => m.SigninPageModule),
  },
  {
    path: 'verfication-code',
    loadChildren: () =>
      import(`./pages/verification-code/verification-code.module`).then(
        (m) => m.VerificationCodePageModule
      ),
  },


  {
    path: '',
    redirectTo: '/signin', 
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

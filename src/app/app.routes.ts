import { Routes } from '@angular/router';
import { weather } from './pages/weather';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'weather',
        pathMatch:'full'
    },
    {
        path:'weather',
        component:weather
    }
];

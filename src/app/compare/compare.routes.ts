import { CompareComponent }   from './compare.component';
import { SECDataResolve } from './secdata.resolve';

export const CompareRoutes = [
  {
    path: 'compare/:ticker1/:ticker2',
    component: CompareComponent,
    resolve: { compare: SECDataResolve }
  }
];
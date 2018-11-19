import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRouteSnapshot, ActivationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { routeAnimations, TitleService, selectAuth } from '@app/core';
import {
  State as BaseSettingsState,
  selectSettingsLanguage
} from '@app/settings';

import { State as BaseExamplesState } from '../examples.state';

interface State extends BaseSettingsState, BaseExamplesState {}

@Component({
  selector: 'sma-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  language$: Observable<string>;
  activatedRouteSnapshot$: Observable<ActivatedRouteSnapshot>;

  examples = [
    { link: 'todos', label: 'sma.examples.menu.todos' },
    { link: 'stock-market', label: 'sma.examples.menu.stocks' },
    { link: 'theming', label: 'sma.examples.menu.theming' },
    { link: 'crud', label: 'sma.examples.menu.crud' },
    { link: 'form', label: 'sma.examples.menu.form' },
    { link: 'notifications', label: 'sma.examples.menu.notifications' },
    { link: 'authenticated', label: 'sma.examples.menu.auth', auth: true }
  ];

  constructor(
    private store: Store<State>,
    private router: Router,
    private titleService: TitleService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(
      this.router.routerState.snapshot.root,
      this.translate
    );
    this.translate.setDefaultLang('en');

    this.isAuthenticated$ = this.store.pipe(
      select(selectAuth),
      map(auth => auth.isAuthenticated)
    );
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.activatedRouteSnapshot$ = this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      map((event: ActivationEnd) => event.snapshot)
    );
  }

  updateLanguage(language: string) {
    this.translate.use(language);
  }

  updateTitle(activatedRouteSnapshot: ActivatedRouteSnapshot) {
    this.titleService.setTitle(activatedRouteSnapshot, this.translate);
  }
}

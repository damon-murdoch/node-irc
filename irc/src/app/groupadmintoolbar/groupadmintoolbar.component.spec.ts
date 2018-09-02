import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupadmintoolbarComponent } from './groupadmintoolbar.component';

describe('GroupadmintoolbarComponent', () => {
  let component: GroupadmintoolbarComponent;
  let fixture: ComponentFixture<GroupadmintoolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupadmintoolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupadmintoolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

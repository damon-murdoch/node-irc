import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupmenuComponent } from './groupmenu.component';

describe('GroupmenuComponent', () => {
  let component: GroupmenuComponent;
  let fixture: ComponentFixture<GroupmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

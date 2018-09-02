import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadmintoolbarComponent } from './superadmintoolbar.component';

describe('SuperadmintoolbarComponent', () => {
  let component: SuperadmintoolbarComponent;
  let fixture: ComponentFixture<SuperadmintoolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperadmintoolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadmintoolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

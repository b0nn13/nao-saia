import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { CategoryService } from './../services/category.service';
import { User } from '../domain/User';
import { UserService } from '../services/user.service';
import { City } from '../domain/City';
import { State } from '../domain/State';
import { StateService } from '../services/state.service';
import { CityService } from '../services/city.service';
import { GeolocationService } from '../services/geolocation-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MerchantService } from '../services/merchant.service';
import { AbstractViewComponent } from '../shared/abstract.view.component';
import { Merchant } from '../domain/Merchant';
import { Component, OnInit } from '@angular/core';
import { Category } from '../domain/Category';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-merchant-register',
  templateUrl: './merchant-register.component.html',
  styleUrls: ['./merchant-register.component.css']
})
export class MerchantRegisterComponent extends AbstractViewComponent implements OnInit {

  model: Merchant;

  categoriesDataSource: string[];
  phone: string;

  states: Array<State>;
  cities: Array<City>;

  useGeolocation: boolean;
  geolocationEnable: boolean;
  cpfCnjValid: boolean = true;
  telephoneValid: boolean = true;
  cellPhoneValid: boolean = true;
  zipCodeValid: boolean = true;

  constructor(
    private service: MerchantService,
    private router: Router,
    private route: ActivatedRoute,
    private geoLocation: GeolocationService,
    private cityService: CityService,
    private stateService: StateService,
    private userService: UserService,
    private categoryService: CategoryService,
    toastr: ToastrService,
    private googleAnalytics: GoogleAnalyticsService) {
    super(toastr);
    this.model = new Merchant();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const merchantId = params['merchantId'];
      if (merchantId) {
        this.findMerchantById(merchantId);
      } else {
        this.addIdUserLogged();
      }
    });
    this.loadCategories();
    this.geolocationEnable = this.geoLocation.isGeolocationEnable();
  }

  findMerchantById(merchantId: string) {
    this.service.findById(merchantId)
      .subscribe((merchant: Merchant) => {
        this.model = Merchant.of(merchant);
        if (this.model.phones && this.model.phones.length > 0) {
          this.phone = this.model.phones[0];
          this.model.phones = [];
        }
      });
  }

  addIdUserLogged() {
    this.userService.getUserLogged()
      .subscribe((userLogged: User) => this.model.userId = userLogged.id);
  }

  save(): void {

    this.model.phones.push(this.phone);

    if (this.isFormValid()) {
      this.service.save(this.model).subscribe(
        () => {
          this.googleAnalytics.eventEmitter('add_merchant', 'merchant', 'register', 'new', 1);
          super.showAlertInfo('Estabelecimento cadastrado com sucesso!');
          setTimeout(() => {
            this.router.navigate([`/my-merchants`]);
          }, 3000);
        },
        reject => {
          let message = reject.error.message;
          if (!message) {
            message =  'Erro ao cadastrar usuário';
          }
          super.showAlertWarning(message);
        });
    } else {
      super.showAlertWarning('Cadastro inválido verifique os campos obrigatórios!');
    }
  }

  isFormValid() {
    return this.model.valid() && this.cpfCnjValid
            && this.telephoneValid;
  }

  changeCEP(data): void {
    const zipcode = this.model?.address?.zipcode ?? null;
    if (zipcode && this.zipCodeValid) {
      this.geoLocation.getAddressFromZipCode(zipcode).subscribe(address => {
        this.model.address = address;
      }, error => {
        super.showAlertWarning('Erro ao consultar CEP');
        console.log(error);
      });
    }
  }

  changeGeolocation(data): void {
    if (this.useGeolocation) {
      this.geoLocation.getCurrentLocation(this.model.address).subscribe(
        address => {
          this.model.address = address;
        },
        error => {
          super.showAlertWarning('Erro ao obter localização');
          console.log(error);
        });
    } else {
      this.model.clearAddress();
    }
  }

  loadStates(): void {
    this.states = [];
    this.stateService.findAll().subscribe(states => {
      this.states = states;
    });
  }

  loadCities(): void {
    this.cities = [];
    this.cityService.findByUF(this.model.address.state).subscribe(cities => {
      this.cities = cities;
    });
  }

  loadCategories(): void {
    this.categoriesDataSource = [];
    this.model.categories = ['Restaurante', 'Hamburgueria', 'Pizzaria', 'Outros'];
    this.categoryService.findAll().subscribe(categories => {
      this.categoriesDataSource = categories.map(item => item.name);
    });
  }

  setCpfCnpjValid(cpfCnpjValid: boolean) {
    this.cpfCnjValid = cpfCnpjValid;
  }

  setTelephoneValid(telephone: boolean) {
    this.telephoneValid = telephone;
  }

  setCellPhoneValid(cellPhone: boolean) {
    this.cellPhoneValid = cellPhone;
  }

  setZipCodeValid(zipCode: boolean) {
    this.zipCodeValid = zipCode;
  }
}

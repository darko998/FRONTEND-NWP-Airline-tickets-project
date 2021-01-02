import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private readonly baseUrl = "http://localhost:8080/companies";

  private companies: Observable<Company[]>
  public companyById: Observable<Company>
  public updatedCompany: Observable<Company>
  public newCompany: Observable<Company>

  constructor(private http: HttpClient) { }

  public getCompanies() {
    if (this.companies == undefined) {
      this.fetchCompanies();
    }

    return this.companies;
  }

  fetchCompanies() {
    this.companies = this.http.get<Company[]>(this.baseUrl, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.companies;
  }

  fetchById(id) {
    this.companyById = this.http.get<Company>(this.baseUrl + "/" + id, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.companyById;
  }

  deleteCompany(id) {
    this.http.delete(this.baseUrl + "/" + id, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    }).toPromise();

    return this.companies;
  }

  addCompany(company) {
    this.newCompany = this.http.post<Company>(this.baseUrl, company, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.newCompany;
  }

  updateCompany(company) {
    this.updatedCompany = this.http.put<Company>(this.baseUrl, company, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.updatedCompany;
  }
}

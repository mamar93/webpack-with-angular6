import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';



@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }
    baseUrl: string = 'http://localhost:3000/api/users';
    getAll() {
        return this.http.get<User[]>(this.baseUrl);
    }

    getById(id: number) {
        return this.http.get(this.baseUrl + id);
    }

    register(user: User) {
        return this.http.post(this.baseUrl, user);
    }

    update(user: User) {
        return this.http.put(this.baseUrl + '/' + user._id, user);
    }

    delete(id: number) {
        return this.http.delete(this.baseUrl + '/' + id);
       
    }
    authenticate(user : User){
        return this.http.post<User>(this.baseUrl+"/login", user);
    }
    
}
import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';

import { HomePage } from '../home/home';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
    selector: 'page-login',
    templateUrl: 'Login.html'
})

export class LoginPage{
    loading: Loading;

    constructor(private navCtrl: NavController,public loadingCtrl: LoadingController,
    private googlePlus: GooglePlus, private nativeStorage: NativeStorage,
    private homePage: HomePage){

    }

    doGoogleLogin(){
        let nav = this.navCtrl;
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.googlePlus.login({
            'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
            'webClientId': 'webClientId.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
            'offline': true
        })
        .then(function (user) {
            loading.dismiss();

            this.nativeStorage.setItem('user', {
            name: user.displayName,
            email: user.email,
            picture: user.imageUrl
            })
            .then(function(){
            nav.push(this.homePage);
            }, function (error) {
            console.log(error);
            })
        }, function (error) {
            loading.dismiss();
        });
    }

    doGoogleLogout(){
        let nav = this.navCtrl;
        this.googlePlus.logout()
        .then(function (response) {
            this.nativeStorage.remove('user');
            nav.push(LoginPage);
        },function (error) {
            console.log(error);
        });
    }
}


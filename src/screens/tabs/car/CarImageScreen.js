import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Row, Grid } from 'react-native-easy-grid';
import { Button,  Content, Text} from 'native-base';
import Gallery from 'react-native-image-gallery'
import Utils from '../../../common/utils';
import {PuantajService} from '../../../services';
import {AddWehicleImageRequestModel} from '../../../../src/models';
import {Alert} from 'react-native';

export default class CarImageScreen extends Component {
    utils = new Utils();
    puantajService=new PuantajService();

    render() {
        const carImages=[];
        this.props.carImages.map((image, index) => (
            carImages.push({
                source:{
                    uri:image.fullPath
                }
            })
        ));

        return (
            <Grid style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 2 }}>
                <Row size={10} style={{ marginBottom: 5 }}>
                    <Button full light onPress={() => this.utils.pickImage().then(t=> this.addImage(t))}>
                        <Text>Yeni Resim Ekle</Text>
                    </Button>
                </Row>
                <Row size={80}>
                    <Gallery
                        style={{backgroundColor: 'white' }}
                        images={carImages}
                    />
                </Row>
            </Grid>
        );
     }

     //api methods
     addImage(image) {
        var request = new AddWehicleImageRequestModel();
        request.Token = this.props.token;
        request.ID = this.props.carInsuranceInfo.ID;
        request.startDate = "";
        request.endDate = "";
        request.entryID = this.props.selectedCarId;
        request.startEndDocumentType = "9"; //Image
        request.fileLocationType = "9"; //Image
        request.force = "false";
        request.image = image.uri;
        request.sigortaID = this.props.carInsuranceInfo.sigortaID;
        request.plaka = this.props.carInsuranceInfo.plaka;
        request.isDateRequired = "false";

        this.puantajService.addImage(request).then(responseJson => {         
            if (responseJson.IsSuccess) {
                Alert.alert("Araba resmi eklendi");
                this.props.reloadCarImages(request.entryID);
            }
            else {
                Alert.alert(responseJson.ExceptionMsg);
            }
        }).catch((error) => {
            console.error(error);
        });
    }
   }
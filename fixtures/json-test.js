/**
 * Created by noam on 1/16/16.
 */

function Json(){
    this.setJson = function(jsonObject){
        this.obj = jsonObject;
    }

    this.XAndY = function(){
        return this.obj.x + " " + this.obj.y;
    }
}
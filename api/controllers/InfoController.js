/**
 * InfoController
 *
 * @description :: Server-side logic for managing Infoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getMain: function(req, res){
        // fromCoord = Info.place_search(fromString);
        // toCoord = Info.place_search(toString);
        //Info.uber_data(function(){
            return res.view('main', {
                uber:[],
                auto:[]
            });
        //});
    },
    estimate: function(req, res){
        var from = req.query.from;
        var to = req.query.to;
        
        infoService.place_search(from, function(fromLoc){
            infoService.place_search(to, function(toLoc){
                infoService.google_distance(fromLoc, toLoc, function(dist){
                    var autoEst = 25 + ((dist.distance.value - 2000) > 0 ? 
                        (dist.distance.value - 2000)*13/1000 : 0); 
                    var auto = {distance: dist.distance.text, estimate: autoEst};
                    infoService.uber_data(fromLoc, toLoc, function(uberEst){
                        var estObj = {
                            'uber': uberEst,
                            'auto': auto
                        };

                       return res.view('result', estObj);
                    });
                });
            });
        });

    }

};




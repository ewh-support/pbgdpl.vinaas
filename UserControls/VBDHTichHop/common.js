(function ($) {
    $.fn.siSerializeDivFrm = function () {
        var values = {};
        var $input = $('input, select, textarea');
        var $inputs = $(this).find($input);
        $inputs.each(function () {
            if ($(this).val() != "" && $(this).val() != undefined) {
                var attr = $(this).attr('multiple');
                if (typeof attr !== typeof undefined && attr !== false) {
                    var $mangvalue = $(this).val();
                    values[this.name] = $mangvalue.join(",");
                }
                else {
                    values[this.name] = $(this).val().trim();
                }
            }

        });
        return values;
    };


    //Grid boostrap.
    $.fn.siGridboostrap = function (settings) {
        var config = {
            UrlPost: "",
            aaSorting: [0, 'desc'],
            STT: 1,
            headers: {},
            visible: true,
            length: '20',
            isColumSTT: false,
            parameterPlus: function (para) {

            },
            drawCallback: function (settings) {


            },
            // Các cấu hình mặc định
            columns: [
                {
                    "mData": function (o) {
                        return '<a target="_blank" data-id="' + o.ID + '" href="?ItemID=' + o.ID + '">' + o.Title + '</a>';
                    },
                    "name": "Title",
                    "sTitle": "Tiêu đề",
                }
            ],
            messageInfo: 'Hiển thị _START_ đến _END_ trên _TOTAL_ bản ghi'
        };
        config = $.extend(config, settings);
        var $oder = [];
        if (config.isColumSTT) {
            var itemTemp = {
                "sTitle": "STT",
                "width": "3%",
                "render": function (rowData, type, row, meta) {
                    return "<div class='STTgrid'>" + ++meta.settings.json.Request.start + "</div>";
                }
            };
            config.columns.splice(0, 0, itemTemp);
            $oder = [
                { "orderable": false, "targets": 0 }
            ];
        }
        return this.each(function () {
            var $idelement = $(this).attr("id");
            var $gridparent = $(this).closest(".smgrid");
            var tblBSDataTable = $(this).DataTable(
                {
                    "language": {
                        "info": config.messageInfo
                    },
                    "lengthMenu": [[config.length, 20, 30, 50, 100], [config.length, 20, 30, 50, 100]],
                    "dom": 't<"col-xs-12 col-sm-4 col-md-4 nopadding infortotal"i><"col-xs-12 col-sm-8 col-md-8 pull-right nopadding"p><"clear">',
                    "searching": false,
                    "lengthChange": false,
                    "visible": config.visible,
                    //"length": config.length,
                    "columnDefs": $oder,
                    "processing": true, //show processing text while request data
                    "serverSide": true,// request data from server side
                    "aaSorting": config.aaSorting,
                    "aoColumns": config.columns,
                    "drawCallback": config.drawCallback,
                    "paging": true,
                    "ajax":
                    {
                        "type": "POST",
                        url: config.UrlPost,

                        "dataSrc": "Data",
                        "dataType": "json",
                        data: function (options) {
                            if (jQuery.isFunction(config.parameterPlus)) {
                                config.parameterPlus(options); //
                            }
                            //debugger;
                            var $zonesearch = $gridparent.find(".zone_search").first();//$("#" + $idelement + " zone_search:first");
                            if ($zonesearch != undefined) {
                                options = $.extend({}, options, $zonesearch.siSerializeDivFrm());
                            }
                            return options;
                        }
                    },

                });
        })
    };

})(jQuery);
function RefreshGridDT(id) {
    
    var $tagData = $("#" + id).closest("div[role='body-data']");
    var $idtable = $tagData.find("table.smdataTable").first().dataTable().fnDraw(false);
}

function formatDate(strValue) {

    if (strValue == null) return "";
    //var date = new Date(strValue);
    var d = new Date(strValue);
    var month = d.getMonth() + 1;
    var day = d.getDate();

    var output = //(('' + hour).length < 2 ? '0' : '') + hour + ':' +
        //(('' + minute).length < 2 ? '0' : '') + minute + " ngày " +
        (('' + day).length < 2 ? '0' : '') + day + '/' +
        (('' + month).length < 2 ? '0' : '') + month + '/' +
        d.getFullYear();
    //return date.format('HH:mm') + ' ngày ' +  date.format('dd/MM/yyyy');
    return output;
    //return date.format('HH:mm') + ' ngày ' +  date.format('dd/MM/yyyy');
}
function formatDateTime(strValue) {
    if (strValue == null) return "";
    //var date = new Date(strValue);
    var d = new Date(strValue);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var output = (('' + hour).length < 2 ? '0' : '') + hour + ':' +
        (('' + minute).length < 2 ? '0' : '') + minute + ' ' +
        (('' + day).length < 2 ? '0' : '') + day + '/' +
        (('' + month).length < 2 ? '0' : '') + month + '/' +
        d.getFullYear();
    //return date.format('HH:mm') + ' ngày ' +  date.format('dd/MM/yyyy');
    return output;
    //return date.format('HH:mm') + ' ngày ' +  date.format('dd/MM/yyyy');
}
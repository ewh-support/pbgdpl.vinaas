var lastGirdHeight;
var urlDeleteFrefix = "";
var urlShowFrefix = "";
var urlHideFrefix = "";
var urlShowFrefix = "";
var imageLoading = "Đang tải dữ liệu...";
var urlLists = '';
var urlForm = '';
var urlWorkFlow = '';
var urlFormGroup = '';
var urlPostAction = '';
var urlPostActionGroup = '';
var urlSort = '';
var urlSortGroup = '';
var urlView = '';
var urlResetPass = '';
var urlResetPassByAdmin = '';
var urlConfig = '';
var urlViewGroup = '';
var formHeight = 'auto';
var formWidth = '600';


function openPopup(level, container, values, urlPage, pageTitle, width, height) {
    //Mở ra form, thêm mới dữ liệu, trả html về container
    $.post(urlPage, { "values": "" + values + "", "container": "" + container + "" }, function (data) {
        $("#dialog-form-" + level).html(data).dialog(
			{
			    title: pageTitle,
			    width: width,
			    height: height
			}).dialog("open");
    });
}

function formatRowView() {
    var index = 0;
    $(".table-form tr").each(function () {
        index++;
        if (index % 2 == 0) {
            $(this).addClass("odd");
        }
    });
}

function formatRowForm() {
    var index = 0;
    $(".tableforms tr").each(function () {
        index++;
        if (index % 2 == 0) {
            $(this).addClass("odd");
        }
    });
}

function initAjaxLoad(urlListLoad, container) {
    //$(document).ready(function() {
    $.address.unbind().change(function (event) {
        var urlTransform = urlListLoad;
        var urlHistory = event.value;
        if (urlHistory.length > 0) {
            urlHistory = urlHistory.substring(1, urlHistory.length);
            if (urlTransform.indexOf('?') > 0)
                urlTransform = urlTransform + '&' + urlHistory;
            else
                urlTransform = urlTransform + '?' + urlHistory;
        }
        $(container).html(imageLoading);
        //loading();
        $.post(urlTransform, function (data) {
            $(container).html(data);
            //endLoading();
        });
    });
    //});
}
//ham load lại đơn thuần, không thay đổi 
function AjaxLoadNotReload(urlListLoad, container) {
    $(container).html(imageLoading);
    //loading();
    $.post(urlListLoad, function (data) {
        $(container).html(data);
        //endLoading();
    });
}
function changeHashValue(key, value, source) {
    value = encodeURIComponent(value);
    var currentLink = source.substring(1);
    var returnLink = '#';
    var exits = false;
    if (currentLink.indexOf('&') > 0) { // lớn hơn 1
        var tempLink = currentLink.split('&');
        for (idx = 0; idx < tempLink.length; idx++) {
            if (key == tempLink[idx].split('=')[0]) { //check Exits
                returnLink += key + '=' + value;
                exits = true;
            }
            else {
                returnLink += tempLink[idx];
            }
            if (idx < tempLink.length - 1)
                returnLink += '&';
        }
        if (!exits)
            returnLink += '&' + key + '=' + value;
    } else if (currentLink.indexOf('=') > 0) { //Chỉ 1
        returnLink = '#' + currentLink + '&' + key + '=' + value;
    }
    else
        returnLink = '#' + key + '=' + value;
    return returnLink;
}

//Chuyển trang với value mới
function changeHashUrl(key, value) {
    var currentLink = $.address.value();
    return changeHashValue(key, value, currentLink);
}


function registerGridView(selector) {
    //Đổi màu row
    $(selector + " .gridView tr").each(function (index) {
        if (index % 2 == 0)
            $(this).addClass("odd");
    });
    //alert('?');
    $(selector + " .gridView a.RaSoatAll").click(function () {
        var arrRowId = '';
        var rowTitle = '';
        var linkFW = '';
        var linkFW = (linkFW == '') ? '#' + urlShowFrefix + 'Page=1' : '#' + urlShowFrefix + linkFW;
        $(selector + " input[type='checkbox']:checked").not("#checkAll").not(".checkAll").each(function () {
            arrRowId += $(this).val() + ",";
            rowTitle += "<li>" + escapeHTML($(this).parent().parent().attr("title")) + "</li>";
        });
        rowTitle = "<ul>" + rowTitle + "</ul>";

        arrRowId = (arrRowId.length > 0) ? arrRowId.substring(0, arrRowId.length - 1) : arrRowId;
        rowRaSoat(urlPostAction, arrRowId, rowTitle, linkFW);
        return false;
    });

    function rowRaSoat(urlPost, arrRowId, rowTitle, urlFw) {
        var titleDia = '';
        if (arrRowId == '')
            createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
        else {
            if (arrRowId.indexOf(',') > 0)
                titleDia = "Hiển thị các bản ghi đã chọn";
            else
                titleDia = "Hiển thị bản ghi đã chọn";
            $("#dialog-confirm").attr(titleDia);
            $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn rà soát:</b><br />" + rowTitle + "</p>");
            var comfirmReturn = false;
            $("#dialog-confirm").dialog({
                title: titleDia,
                resizable: false,
                height: 'auto',
                width: 'auto',
                modal: false,
                buttons: {
                    "Tiếp tục": function () {
                        $(this).dialog("close");
                        $.post(encodeURI(urlPost), { "do": "rasoat", "itemId": "" + arrRowId + "" }, function (data) {
                            if (data.Erros) {
                                createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                            }
                            else {
                                createMessage("Thông báo", data.Message);
                                window.location.href = urlFw + '&type=show&idShow=' + arrRowId;
                            }
                        });
                    },
                    "Hủy lệnh hiển thị": function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    }

    //Sắp xếp các cột
    $(selector + " .gridView th a").each(function (idx) {
        var link = $(this).attr("href");
        if (link != '' && link != 'undefined' && link != null) {
            link = link.substring(1, link.length);
            if ($.address.value().indexOf(link) > 0) {
                if ($.address.value().indexOf('FieldOption=1') > 0) {
                    $(this).addClass('desc');
                    $(this).attr("href", '#' + link + '&FieldOption=0');
                }
                else {
                    $(this).addClass('asc');
                    $(this).attr("href", '#' + link + '&FieldOption=1');
                }
            }
        }
    });

    //khi người dùng click trên 1 row
    $(selector + " .gridView tr").not("first").click(function () {
        $(selector + " .gridView tr").removeClass("hightlight");
        $(this).addClass("hightlight");
    });

    //checkall
    $(selector + ' .checkAll').click(function () {

        var selectQuery = selector + " input[type='checkbox']";
        if ($(this).val() != '')
            selectQuery = selector + " #" + $(this).val() + " input[type='checkbox']";
        $(selectQuery).attr('checked', $(this).is(':checked'));
    });
    $('#searchPopupSimple' + ' .selectAll').click(function () {
        var selectQuery = '#searchPopupSimple' + " input[type='checkbox']";
        if ($(this).val() != '')
            selectQuery = '#searchPopupSimple' + " #" + $(this).val() + " input[type='checkbox']";
        $(selectQuery).attr('checked', $(this).is(':checked'));
    });



    //Nhảy trang
    $(selector + " .bottom-pager input").change(function () {
        var cPage = trim12($(this).val());
        var maxPage = $(selector + " .bottom-pager input[type=hidden]").val();
        if (cPage.length == 0)
            createMessage("Thông báo", "Yêu cầu nhập trang cần chuyển đến");
        else if (isNaN(cPage))
            createMessage("Thông báo", "trang chuyển đến phải là kiểu số");
        else if (parseInt(cPage) > maxPage)
            createMessage("Thông báo", "trang không được lớn hơn " + maxPage + "");
        else if (parseInt(cPage) <= 0) {
            createMessage("Thông báo", "trang phải lớn hơn 0");
        }
        else {
            window.location.href = changeHashUrl('Page', cPage);;
        }
    });

    //ẩn hiện nhóm
    $(selector + " .gridView a.group").click(function () {
        var idShowHide = $(this).attr("href");
        if ($(this).text() == '+') {
            $(idShowHide).show();
            $(this).text("-");
        } else {
            $(idShowHide).hide();
            $(this).text("+");
        }
        return false;
    });

    //Thay đổi số bản ghi trên trang
    $(selector + " .bottom-pager select").change(function () {
        var urlFWs = $.address.value();
        urlFWs = changeHashValue("Page", 1, urlFWs); //Replace  &Page=.. => Page=1
        urlFWs = changeHashValue("RowPerPage", $(this).val(), urlFWs); //Replace  &TenDonVi=.. => TenDonVi=donViNhan
        window.location.href = urlFWs;
    });

    //Đăng ký xóa nhiều
    $(selector + " .gridView a.deleteAll").click(function () {
        var arrRowId = '';
        var rowTitle = '';
        var linkFW = '';
        var linkFW = (linkFW == '') ? '#' + urlDeleteFrefix + 'Page=1' : '#' + urlDeleteFrefix + linkFW;
        $(selector + " input[type='checkbox']:checked").not("#checkAll").not(".checkAll").each(function () {
            arrRowId += $(this).val() + ",";
            rowTitle += "<li>" + escapeHTML($(this).parent().parent().attr("title")) + "</li>";
        });
        rowTitle = "<ul>" + rowTitle + "</ul>";

        arrRowId = (arrRowId.length > 0) ? arrRowId.substring(0, arrRowId.length - 1) : arrRowId;
        rowDelete(urlPostAction, arrRowId, rowTitle, linkFW);
        return false;
    });
    //Đăng ký approved nhiều
    $(selector + " .gridView a.approvedAll").click(function () {
        var arrRowId = '';
        var rowTitle = '';
        var linkFW = '';
        var linkFW = (linkFW == '') ? '#' + urlDeleteFrefix + 'Page=1' : '#' + urlDeleteFrefix + linkFW;
        $(selector + " input[type='checkbox']:checked").not("#checkAll").not(".checkAll").each(function () {
            arrRowId += $(this).val() + ",";
            rowTitle += "<li>" + escapeHTML($(this).parent().parent().attr("title")) + "</li>";
        });
        rowTitle = "<ul>" + rowTitle + "</ul>";

        arrRowId = (arrRowId.length > 0) ? arrRowId.substring(0, arrRowId.length - 1) : arrRowId;
        rowapproved(urlPostAction, arrRowId, rowTitle, linkFW);
        return false;
    });
    //xoa approed tren grid
    function rowapproved(urlPost, arrRowId, rowTitle, urlFw) {
        var titleDia = '';
        if (arrRowId == '')
            createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
        else {
            if (arrRowId.indexOf(',') > 0)
                titleDia = "Duyệt các bản ghi đã chọn";
            else
                titleDia = "Duyệt bản ghi đã chọn";
            $("#dialog-confirm").attr(titleDia);
            $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn duyệt:</b><br />" + rowTitle + "</p>");
            var comfirmReturn = false;
            $("#dialog-confirm").dialog({
                title: titleDia,
                resizable: false,
                height: 'auto',
                width: 'auto',
                modal: false,
                buttons: {
                    "Tiếp tục": function () {
                        $(this).dialog("close");
                        $.post(encodeURI(urlPost), { "do": "approved", "itemId": "" + arrRowId + "" }, function (data) {
                            if (data.Erros) {
                                createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                            }
                            else {
                                createMessage("Thông báo", data.Message);
                                window.location.href = urlFw + '&type=approved&idapproved=' + arrRowId;
                            }
                        });
                    },
                    "Hủy lệnh duyệt": function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    }
    //
    //Đăng ký Pending nhiều
    $(selector + " .gridView a.PendingAll").click(function () {
        var arrRowId = '';
        var rowTitle = '';
        var linkFW = '';
        var linkFW = (linkFW == '') ? '#' + urlDeleteFrefix + 'Page=1' : '#' + urlDeleteFrefix + linkFW;
        $(selector + " input[type='checkbox']:checked").not("#checkAll").not(".checkAll").each(function () {
            arrRowId += $(this).val() + ",";
            rowTitle += "<li>" + escapeHTML($(this).parent().parent().attr("title")) + "</li>";
        });
        rowTitle = "<ul>" + rowTitle + "</ul>";

        arrRowId = (arrRowId.length > 0) ? arrRowId.substring(0, arrRowId.length - 1) : arrRowId;
        rowPending(urlPostAction, arrRowId, rowTitle, linkFW);
        return false;
    });
    //xoa Pending tren grid
    function rowPending(urlPost, arrRowId, rowTitle, urlFw) {
        var titleDia = '';
        if (arrRowId == '')
            createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
        else {
            if (arrRowId.indexOf(',') > 0)
                titleDia = "Hủy duyệt các bản ghi đã chọn";
            else
                titleDia = "Hủy duyệt bản ghi đã chọn";
            $("#dialog-confirm").attr(titleDia);
            $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn hủy duyệt:</b><br />" + rowTitle + "</p>");
            var comfirmReturn = false;
            $("#dialog-confirm").dialog({
                title: titleDia,
                resizable: false,
                height: 'auto',
                width: 'auto',
                modal: false,
                buttons: {
                    "Tiếp tục": function () {
                        $(this).dialog("close");
                        $.post(encodeURI(urlPost), { "do": "Pending", "itemId": "" + arrRowId + "" }, function (data) {
                            if (data.Erros) {
                                createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                            }
                            else {
                                createMessage("Thông báo", data.Message);
                                window.location.href = urlFw + '&type=Pending&idPending=' + arrRowId;
                            }
                        });
                    },
                    "Hủy lệnh hủy duyệt": function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    }
    //
    //
    //Đăng ký update cơ quan liên quan
    $(selector + " .gridView a.updateAll").click(function () {
        var arrRowId = '';
        var rowTitle = '';
        var linkFW = '';
        var linkFW = (linkFW == '') ? '#' + urlDeleteFrefix + 'Page=1' : '#' + urlDeleteFrefix + linkFW;
        $(selector + " input[type='checkbox']:checked").not("#checkAll").not(".checkAll").each(function () {
            arrRowId += $(this).val() + ",";
            rowTitle += "<li>" + escapeHTML($(this).parent().parent().attr("title")) + "</li>";
        });
        rowTitle = "<ul>" + rowTitle + "</ul>";

        arrRowId = (arrRowId.length > 0) ? arrRowId.substring(0, arrRowId.length - 1) : arrRowId;
        rowUpdateCQLQ(urlPostAction, arrRowId, rowTitle, linkFW);
        return false;
    });
    //Đăng kí ẩn hiện nhiều
    $(selector + " .gridView a.ShowAll").click(function () {
        var arrRowId = '';
        var rowTitle = '';
        var linkFW = '';
        var linkFW = (linkFW == '') ? '#' + urlDeleteFrefix + 'Page=1' : '#' + urlDeleteFrefix + linkFW;
        $(selector + " input[type='checkbox']:checked").not("#checkAll").not(".checkAll").each(function () {
            arrRowId += $(this).val() + ",";
            rowTitle += "<li>" + escapeHTML($(this).parent().parent().attr("title")) + "</li>";
        });
        rowTitle = "<ul>" + rowTitle + "</ul>";

        arrRowId = (arrRowId.length > 0) ? arrRowId.substring(0, arrRowId.length - 1) : arrRowId;
        rowDelete(urlPostAction, arrRowId, rowTitle, linkFW);
        return false;
    });

    $(selector + " .gridView a.getAll").click(function () {
        var arrRowId = '';
        var rowTitle = '';
        var linkFW = '';
        var linkFW = (linkFW == '') ? '#' + urlDeleteFrefix + 'Page=1' : '#' + urlDeleteFrefix + linkFW;
        $(selector + " input[type='checkbox']:checked").not("#checkAll").not(".checkAll").each(function () {
            arrRowId += $(this).val() + ",";
            rowTitle += "<li>" + escapeHTML($(this).parent().parent().attr("title")) + "</li>";
        });
        rowTitle = "<ul>" + rowTitle + "</ul>";

        arrRowId = (arrRowId.length > 0) ? arrRowId.substring(0, arrRowId.length - 1) : arrRowId;
        rowGet(urlPostAction, arrRowId, rowTitle, linkFW);
        return false;
    });

    $(selector + " .gridView a.publicAll").click(function () {
        var arrRowId = '';
        var arrRowIdAll = '';
        var arrRowRemove = '';
        var rowTitle = '';
        var linkFW = '';
        var linkFW = (linkFW == '') ? '#' + urlDeleteFrefix + 'Page=1' : '#' + urlDeleteFrefix + linkFW;
        $(selector + " input[type='checkbox']:checked").not("#checkAll").not(".checkAll").each(function () {
            arrRowId += $(this).val() + ",";
            rowTitle += "<li>" + escapeHTML($(this).parent().parent().attr("title")) + "</li>";
        });
        $(selector + " input[type='checkbox']").each(function () {
            arrRowIdAll += $(this).val() + ",";
        });
        rowTitle = "<ul>" + rowTitle + "</ul>";

        arrRowId = (arrRowId.length > 0) ? arrRowId.substring(0, arrRowId.length - 1) : arrRowId;
        arrRowIdAll = (arrRowIdAll.length > 0) ? arrRowIdAll.substring(0, arrRowIdAll.length - 1) : arrRowIdAll;
        var arrRowIdARR = arrRowId.split(',');
        var arrRowIdAllARR = arrRowIdAll.split(',');
        //        for (var i = 1; i < arrRowIdAllARR.length; i++) {
        //            if (!containsIDRemove(arrRowIdARR, arrRowIdAllARR[i])) {
        //                arrRowRemove += arrRowIdAllARR[i] + ",";
        //            }
        //        }
        publicAll(urlPostAction, arrRowId, arrRowRemove, rowTitle, linkFW);
        return false;
    });

    $(selector + " .gridView a.XoaAll").click(function () {
        var arrRowId = '';
        var arrRowIdAll = '';
        var arrRowRemove = '';
        var rowTitle = '';
        var linkFW = '';
        var linkFW = (linkFW == '') ? '#' + urlDeleteFrefix + 'Page=1' : '#' + urlDeleteFrefix + linkFW;
        $(selector + " input[type='checkbox']:checked").not("#checkAll").not(".checkAll").each(function () {
            arrRowId += $(this).val() + ",";
            rowTitle += "<li>" + escapeHTML($(this).parent().parent().attr("title")) + "</li>";
        });
        $(selector + " input[type='checkbox']").each(function () {
            arrRowIdAll += $(this).val() + ",";
        });
        rowTitle = "<ul>" + rowTitle + "</ul>";

        arrRowId = (arrRowId.length > 0) ? arrRowId.substring(0, arrRowId.length - 1) : arrRowId;
        arrRowIdAll = (arrRowIdAll.length > 0) ? arrRowIdAll.substring(0, arrRowIdAll.length - 1) : arrRowIdAll;
        var arrRowIdARR = arrRowId.split(',');
        var arrRowIdAllARR = arrRowIdAll.split(',');
        //        for (var i = 1; i < arrRowIdAllARR.length; i++) {
        //            if (!containsIDRemove(arrRowIdARR, arrRowIdAllARR[i])) {
        //                arrRowRemove += arrRowIdAllARR[i] + ",";
        //            }
        //        }
        XoaAll(urlPostAction, arrRowId, arrRowRemove, rowTitle, linkFW);
        return false;
    });



    function containsIDRemove(arr, findValue) {
        var i = arr.length;

        while (i--) {
            if (arr[i] === findValue) return true;
        }
        return false;
    }

    //đăng ký publishing row
    //    $(selector + " .gridView a.publishing").click(function () {
    //        rowPublishing(urlPublishing, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
    //        return false;
    //    });
    //publishing row tren grid
    //    function rowPublishing(urlPost, arrRowId, rowTitle, urlFw) {
    //        var titleDia = '';
    //        if (arrRowId == '')
    //            createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    //        else {
    //            if (arrRowId.indexOf(',') > 0)
    //                titleDia = "Xuất bản các bản ghi đã chọn";
    //            else
    //                titleDia = "Xuất bản bản ghi đã chọn";
    //            $("#dialog-confirm").attr(titleDia);
    //            $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn Xuất bản:</b><br />" + rowTitle + "</p>");
    //            var comfirmReturn = false;
    //            $("#dialog-confirm").dialog({
    //                title: titleDia,
    //                resizable: false,
    //                height: 'auto',
    //                width: 'auto',
    //                modal: false,
    //                buttons: {
    //                    "Tiếp tục": function () {
    //                        $(this).dialog("close");
    //                        $.post(encodeURI(urlPost), { "do": "publishing", "itemId": "" + arrRowId + "" }, function (data) {
    //                            if (data.Erros) {
    //                                createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
    //                            }
    //                            else {
    //                                createMessage("Thông báo", data.Message);
    //                                window.location.href = urlFw + '&do=publishing&ItemID=' + arrRowId;
    //                            }
    //                        });
    //                    },
    //                    "Hủy lệnh xuất bản": function () {
    //                        $(this).dialog("close");
    //                    }
    //                }
    //            });
    //        }
    //    }

    //đăng ký publishing row
    $(selector + " .gridView a.publishing").click(function () {
        $("#dialog-form").dialog(
				{
				    title: "Xuất bản tin tức lên list:",
				    width: formlistwidth,
				    height: formlistheight
				}
			).load(encodeURI(urlFormLists + "&do=publishing&ItemID=" + $(this).attr("href").substring(1))).dialog("open");
        return false;
    });



    //đăng ký undo publishing row
    $(selector + " .gridView a.undopublishing").click(function () {
        rowUndoPublishing(urlPublishing, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });
    //đăng ký publishingreject row
    $(selector + " .gridView a.publishingreject").click(function () {
        rowPublishingReject(urlPublishing, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });
    //đăng ký publishingapproved row
    $(selector + " .gridView a.publishingapproved").click(function () {
        rowPublishingApproved(urlPublishing, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });
    //Đăng ký Hiển thị nhiều
    $(selector + " .gridView a.showAll").click(function () {
        var arrRowId = '';
        var rowTitle = '';
        var linkFW = '';
        var linkFW = (linkFW == '') ? '#' + urlShowFrefix + 'Page=1' : '#' + urlShowFrefix + linkFW;
        $(selector + " input[type='checkbox']:checked").not("#checkAll").not(".checkAll").each(function () {
            arrRowId += $(this).val() + ",";
            rowTitle += "<li>" + escapeHTML($(this).parent().parent().attr("title")) + "</li>";
        });
        rowTitle = "<ul>" + rowTitle + "</ul>";

        arrRowId = (arrRowId.length > 0) ? arrRowId.substring(0, arrRowId.length - 1) : arrRowId;
        rowShow(urlPostAction, arrRowId, rowTitle, linkFW);
        return false;
    });


    //Đăng ký ẩn nhiều
    $(selector + " .gridView a.hideAll").click(function () {
        var arrRowId = '';
        var rowTitle = '';
        var linkFW = '';
        var linkFW = (linkFW == '') ? '#' + urlHideFrefix + 'Page=1' : '#' + urlHideFrefix + linkFW;
        $(selector + " input[type='checkbox']:checked").not("#checkAll").not(".checkAll").each(function () {
            arrRowId += $(this).val() + ",";
            rowTitle += "<li>" + escapeHTML($(this).parent().parent().attr("title")) + "</li>";
        });
        rowTitle = "<ul>" + rowTitle + "</ul>";

        arrRowId = (arrRowId.length > 0) ? arrRowId.substring(0, arrRowId.length - 1) : arrRowId;
        rowHide(urlPostAction, arrRowId, rowTitle, linkFW);
        return false;
    });


    //Đăng ký button clone
    $(selector + " .gridView a.clone").click(function () {
        var dbId = $(this).attr("rel");
        rowClone(urlPostAction, $(this).attr("href").substring(1), dbId, escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });

    //Đăng ký button xóa row nhóm
    $(selector + " .gridView a.delete_group").click(function () {
        rowDelete(urlPostActionGroup, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });

    //Đăng ký button hiển thị nhóm
    $(selector + " .gridView a.show_group").click(function () {
        rowShow(urlPostActionGroup, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });

    //Đăng ký button ẩn nhóm
    $(selector + " .gridView a.hide_group").click(function () {
        rowHide(urlPostActionGroup, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlHideFrefix + "Page=1");
        return false;
    });

    //Đăng ký button xóa row
    $(selector + " .gridView a.delete").click(function () {
        rowDelete(urlPostAction, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });

    //Đăng ký button xóa row
    $(selector + " .gridView a.updateCQLQ").click(function () {
        rowUpdateCQLQ(urlPostAction, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });
    //Đăng ký button xóa row
    $(selector + " .gridView a.approved").click(function () {
        rowApproved(urlPostAction, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });

    //Đăng ký button xóa row
    $(selector + " .gridView a.pending").click(function () {
        rowPending(urlPostAction, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });

    //Đăng ký button xóa row
    $(selector + " .gridView a.rejected").click(function () {
        rowReject(urlPostAction, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });

    //Đăng ký button hiển thị
    $(selector + " .gridView a.show").click(function () {
        rowShow(urlPostAction, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });

    //Đăng ký button ẩn
    $(selector + " .gridView a.hide").click(function () {
        rowHide(urlPostAction, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlHideFrefix + "Page=1");
        return false;
    });
    //Đăng ký button hiển thị ngoài trang chủ cho danh mục ảnh
    $(selector + " .gridView a.showInHome").click(function () {
        rowShowInHome(urlPostAction, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlDeleteFrefix + "Page=1");
        return false;
    });

    //Đăng ký button ẩn ngoài trang chủ cho danh mục ảnh
    $(selector + " .gridView a.hideInHome").click(function () {
        rowHideInHome(urlPostAction, $(this).attr("href").substring(1), escapeHTML($(this).attr("title")), "#" + urlHideFrefix + "Page=1");
        return false;
    });

    //đăng ký Thêm row
    $(selector + " .gridView a.add").click(function () {
        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Thêm mới bản ghi';

        var urlRequest = '';
        if (urlForm.indexOf('?') > 0)
            urlRequest = urlForm + '&do=add&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlForm + '?do=add&ItemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: formHeight,
                width: formWidth,
                modal: true
            }).dialog("open");
        });
        return false;
    });
    //đăng ký sửa row
    $(selector + " .gridView a.config").click(function () {
        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Sửa thông tin bản ghi';

        var urlRequest = '';
        if (urlConfig.indexOf('?') > 0)
            urlRequest = urlConfig + '&do=config&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlConfig + '?do=config&ItemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: formHeight,
                width: formWidth,
                modal: true
            }).dialog("open");
        });
        return false;
    });

    //đăng ký sửa row
    $(selector + " .gridView a.edit").click(function () {

        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Sửa thông tin bản ghi';

        var urlRequest = '';
        if (urlForm.indexOf('?') > 0)
            urlRequest = urlForm + '&do=edit&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlForm + '?do=edit&ItemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: formHeight,
                width: formWidth,
                modal: true
            }).dialog("open");
        });
        return false;
    });
	$(selector + " .gridView a.editc2").click(function () {

        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Sửa thông tin bản ghi';

        var urlRequest = '';
		var urlRequest2 = '';
		  if (urlPostAction.indexOf('?') > 0)
            urlRequest2 = urlPostAction + '&do=editcheck&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest2 = urlPostAction + '?do=editcheck&ItemId=' + $(this).attr("href").substring(1);
		
        if (urlForm.indexOf('?') > 0)
            urlRequest = urlForm + '&do=edit&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlForm + '?do=edit&ItemId=' + $(this).attr("href").substring(1);
			 $.post(urlRequest2, function (data) {
				if(data.Erros)
				{ 
					createMessage("Thông báo", data.Message);
				}
				else
				{
					$.post(urlRequest, function (data2) {
					$("#dialog-form").html(data2).dialog({
						title: titleDiag,
						resizable: true,
						height: formHeight,
						width: formWidth,
						modal: true
						}).dialog("open");
					});
				}
			 });
        
        return false;
    });

    //đăng ký sửa row
    $(selector + " .gridView a.workflow").click(function () {
        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Sử lý trạng thái tin tức';

        var urlRequest = '';
        if (urlForm.indexOf('?') > 0)
            urlRequest = urlWorkFlow + '&do=workflow&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlWorkFlow + '?do=workflow&ItemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: formHeight,
                width: formWidth,
                modal: true
            }).dialog("open");
        });
        return false;
    });


    //đăng ký sửa row
    $(selector + " .gridView a.ResetPass").click(function () {

        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Reset mật khẩu người dùng';

        var urlRequest = '';
        if (urlForm.indexOf('?') > 0)
            urlRequest = urlResetPassByAdmin + '&do=resetByAdmin&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlResetPassByAdmin + '?do=resetByAdmin&ItemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: formHeight,
                width: formWidth,
                modal: true
            }).dialog("open");
        });
        return false;
    });
    
    //đăng ký sửa row
    $(selector + " .gridView a.DoiMatKhau").click(function () {

        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Sửa thông tin bản ghi';

        var urlRequest = '';
        if (urlForm.indexOf('?') > 0)
            urlRequest = urlResetPass + '&do=reset&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlResetPass + '?do=reset&ItemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: formHeight,
                width: formWidth,
                modal: true
            }).dialog("open");
        });
        return false;
    });

    //đăng ký sắp xếp
    $(selector + " .gridView a.sort").click(function () {
        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Sắp xếp thứ tự hiển thị';

        var urlRequest = '';
        if (urlSort.indexOf('?') > 0)
            urlRequest = urlSort + '&do=sort&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlSort + '?do=sort&ItemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: formHeight,
                width: formWidth,
                modal: true
            }).dialog("open");
        });
        return false;
    });


    //đăng ký xem row
    $(selector + " .gridView a.view").click(function () {
        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Xem thông tin bản ghi';

        var urlRequest = '';
        if (urlView.indexOf('?') > 0)
            urlRequest = urlView + '&itemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlView + '?itemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: viewHeight,
                width: viewWidth,
                modal: false,
                buttons: {
                    "Đóng cửa sổ": function () {
                        $(this).html("").dialog("close");
                        $("div.ui-dialog-buttonpane").remove();
                    }
                }
            }).dialog("open");;
        });
        return false;
    });

    //đăng ký Thêm row cho nhóm
    $(selector + " .gridView a.add_group").click(function () {
        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Thêm mới bản ghi';

        var urlRequest = '';
        if (urlForm.indexOf('?') > 0)
            urlRequest = urlForm + '&do=add&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlForm + '?do=add&ItemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: formHeight,
                width: formWidth,
                modal: true
            }).dialog("open");
        });
        return false;
    });

    //đăng ký sửa row nhóm
    $(selector + " .gridView a.edit_group").click(function () {
        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Sửa thông tin bản ghi';

        var urlRequest = '';
        if (urlFormGroup.indexOf('?') > 0)
            urlRequest = urlFormGroup + '&do=edit&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlFormGroup + '?do=edit&ItemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: formHeight,
                width: formWidth,
                modal: true
            }).dialog("open");
        });
        return false;
    });


    //đăng ký sắp xếp
    $(selector + " .gridView a.sort_group").click(function () {
        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Sắp xếp thứ tự hiển thị';

        var urlRequest = '';
        if (urlSortGroup.indexOf('?') > 0)
            urlRequest = urlSortGroup + '&do=sort&ItemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlSortGroup + '?do=sort&ItemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: formHeight,
                width: formWidth,
                modal: true
            }).dialog("open");
        });
        return false;
    });


    //đăng ký xem row nhóm
    $(selector + " .gridView a.view_group").click(function () {
        var titleDiag = escapeHTML($(this).attr("title"));
        if (titleDiag == '')
            titleDiag = 'Xem thông tin bản ghi';

        var urlRequest = '';
        if (urlViewGroup.indexOf('?') > 0)
            urlRequest = urlViewGroup + '&itemId=' + $(this).attr("href").substring(1);
        else
            urlRequest = urlViewGroup + '?itemId=' + $(this).attr("href").substring(1);

        $.post(urlRequest, function (data) {
            $("#dialog-form").html(data).dialog({
                title: titleDiag,
                resizable: true,
                height: viewHeight,
                width: viewWidth,
                modal: false,
                buttons: {
                    "Đóng cửa sổ": function () {
                        $(this).html("").dialog("close");
                        $("div.ui-dialog-buttonpane").remove();
                    }
                }
            }).dialog("open");;
        });
        return false;
    });
}

//Hiển thị row tren grid
function rowShow(urlPost, arrRowId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Hiển thị các bản ghi đã chọn";
        else
            titleDia = "Hiển thị bản ghi đã chọn";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn hiển thị:</b><br />" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    $.post(encodeURI(urlPost), { "do": "show", "itemId": "" + arrRowId + "" }, function (data) {
                        if (data.Erros) {
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            createMessage("Thông báo", data.Message);
                            window.location.href = urlFw + '&type=show&idShow=' + arrRowId;
                        }
                    });
                },
                "Hủy lệnh hiển thị": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}


function rowClone(urlPost, arrRowId, dbId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Thu thập dữ liệu văn bản gốc";
        else
            titleDia = "Thu thập dữ liệu văn bản gốc";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn thực hiện thao tác này:</b><br /><br/>Khi thực hiện thao tác này, toàn bộ văn bản gốc hiện tại sẽ bị xóa và thay thế bằng văn bản gốc được thu thập về.<br/><br/>" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    $.post(encodeURI(urlPost), { "do": "clone", "itemId": "" + arrRowId + "", "OldID": "" + dbId + "" }, function (data) {
                        if (data.Erros) {
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            createMessage("Thông báo", data.Message);
                            window.location.href = urlFw + '&type=clone&idClone=' + arrRowId;
                        }
                    });
                },
                "Hủy thu thập": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}

//ẩn row tren grid
function rowHide(urlPost, arrRowId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Ẩn các bản ghi đã chọn";
        else
            titleDia = "Ẩn bản ghi đã chọn";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn ẩn:</b><br />" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    $.post(encodeURI(urlPost), { "do": "hide", "itemId": "" + arrRowId + "" }, function (data) {
                        if (data.Erros) {
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            createMessage("Thông báo", data.Message);
                            window.location.href = urlFw + '&type=hide&idHide=' + arrRowId;
                        }
                    });
                },
                "Hủy lệnh ẩn": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}

//Hiển thị row tren grid
function rowShowInHome(urlPost, arrRowId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Hiển thị các bản ghi đã chọn";
        else
            titleDia = "Hiển thị bản ghi đã chọn";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn hiển thị:</b><br />" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    $.post(encodeURI(urlPost), { "do": "showInHome", "itemId": "" + arrRowId + "" }, function (data) {
                        if (data.Erros) {
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            createMessage("Thông báo", data.Message);
                            window.location.href = urlFw + '&type=showInHome&idShowInHome=' + arrRowId;
                        }
                    });
                },
                "Hủy lệnh hiển thị": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}


//ẩn row tren grid
function rowHideInHome(urlPost, arrRowId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Ẩn các bản ghi đã chọn";
        else
            titleDia = "Ẩn bản ghi đã chọn";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn ẩn:</b><br />" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    $.post(encodeURI(urlPost), { "do": "hideInHome", "itemId": "" + arrRowId + "" }, function (data) {
                        if (data.Erros) {
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            createMessage("Thông báo", data.Message);
                            window.location.href = urlFw + '&type=hideInHome&idHideInHome=' + arrRowId;
                        }
                    });
                },
                "Hủy lệnh ẩn": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}

function rowApproved(urlPost, arrRowId, rowTitle, urlFw) {
    $.post(encodeURI(urlPost), { "do": "approved", "itemId": "" + arrRowId + "" }, function (data) {
        if (data.Erros) {
            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
        }
        else {
            createMessage("Thông báo", data.Message);
            window.location.href = urlFw + '&type=approved&IdApproved=' + arrRowId;
        }
    });
}


function rowUpdateCQLQ(urlPost, arrRowId, rowTitle, urlFw) {
    $.post(encodeURI(urlPost), { "do": "updateCQLQ", "itemId": "" + arrRowId + "" }, function (data) {
        if (data.Erros) {
            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
        }
        else {
            createMessage("Thông báo", data.Message);
            window.location.href = urlFw + '&type=updateCQLQ&IdUpdateCQLQ=' + arrRowId;
        }
    });
}
function rowReject(urlPost, arrRowId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Hủy duyệt các bản ghi đã chọn";
        else
            titleDia = "Hủy duyệt bản ghi đã chọn";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn hủy duyệt:</b><br />" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    $.post(encodeURI(urlPost), { "do": "rejected", "itemId": "" + arrRowId + "" }, function (data) {
                        if (data.Erros) {
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            createMessage("Thông báo", data.Message);
                            window.location.href = urlFw + '&type=rejected&idrejected=' + arrRowId;
                        }
                    });
                },
                "Hủy lệnh": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}

function rowPending(urlPost, arrRowId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Chờ duyệt các bản ghi đã chọn";
        else
            titleDia = "Chờ duyệt bản ghi đã chọn";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn chờ duyệt:</b><br />" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    $.post(encodeURI(urlPost), { "do": "pending", "itemId": "" + arrRowId + "" }, function (data) {
                        if (data.Erros) {
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            createMessage("Thông báo", data.Message);
                            window.location.href = urlFw + '&type=pending&IdPending=' + arrRowId;
                        }
                    });
                },
                "Hủy lệnh": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}

//xoa row tren grid
function rowDelete(urlPost, arrRowId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Xóa các bản ghi đã chọn";
        else
            titleDia = "Xóa bản ghi đã chọn";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn xóa:</b><br />" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    $.post(encodeURI(urlPost), { "do": "delete", "itemId": "" + arrRowId + "" }, function (data) {
                        if (data.Erros) {
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            createMessage("Thông báo", data.Message);
							
                            window.location.href = urlFw + '&type=delete&idDelete=' + arrRowId;
							
                        }
                    });
                },
                "Hủy lệnh xóa": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}


//getAll
function rowGet(urlPost, arrRowId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Lấy các bản ghi đã chọn";
        else
            titleDia = "Lấy bản ghi đã chọn";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn lấy:</b><br />" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    loading();
                    $.post(encodeURI(urlPost), { "do": "getall", "itemId": "" + arrRowId + "" }, function (data) {
                        if (data.Erros) {
                            endLoading();
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            endLoading();
                            createMessage("Thông báo", data.Message);
                            window.location.href = urlFw + '&type=delete&idDelete=' + arrRowId;
                        }
                    });
                },
                "Hủy lệnh lấy": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}
function publicAll(urlPost, arrRowId, arrRowRemove, rowTitle, urlFw) {

    loading();
    $.post(encodeURI(urlPost), { "do": "publicAll", "itemId": "" + arrRowId + "", "itemRemoveId": "" + arrRowRemove + "" }, function (data) {
        if (data.Erros) {
            endLoading();
            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
        }
        else {
            endLoading();
            createMessage("Thông báo", data.Message);
            window.location.href = urlFw + '&type=delete&idDelete=' + arrRowId;
        }
    });

}


function XoaAll(urlPost, arrRowId, arrRowRemove, rowTitle, urlFw) {

    loading();
    $.post(encodeURI(urlPost), { "do": "XoaAll", "itemId": "" + arrRowId + "", "itemRemoveId": "" + arrRowRemove + "" }, function (data) {
        if (data.Erros) {
            endLoading();
            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
        }
        else {
            endLoading();
            createMessage("Thông báo", data.Message);
            window.location.href = urlFw + '&type=delete&idDelete=' + arrRowId;
        }
    });

}


//undo publishing row tren grid
function rowUndoPublishing(urlPost, arrRowId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Thu hồi xuất bản các bản ghi đã chọn";
        else
            titleDia = "Thu hồi xuất bản bản ghi đã chọn";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn thu hồi xuất bản:</b><br />" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    $.post(encodeURI(urlPost), { "do": "undopublishing", "itemId": "" + arrRowId + "" }, function (data) {
                        if (data.Erros) {
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            createMessage("Thông báo", data.Message);
                            window.location.href = urlFw + '&do=undopublishing&ItemID=' + arrRowId;
                        }
                    });
                },
                "Hủy lệnh thu hồi xuất bản": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}
//publishingapproved row tren grid
function rowPublishingApproved(urlPost, arrRowId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Duyệt xuất bản các bản ghi đã chọn";
        else
            titleDia = "Duyệt xuất bản bản ghi đã chọn";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn duyệt xuất bản:</b><br />" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    $.post(encodeURI(urlPost), { "do": "publishingapproved", "itemId": "" + arrRowId + "" }, function (data) {
                        if (data.Erros) {
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            createMessage("Thông báo", data.Message);
                            window.location.href = urlFw + '&do=publishingapproved&ItemID=' + arrRowId;
                        }
                    });
                },
                "Hủy lệnh duyệt xuất bản": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}
//publishingreject row tren grid
function rowPublishingReject(urlPost, arrRowId, rowTitle, urlFw) {
    var titleDia = '';
    if (arrRowId == '')
        createMessage("Thông báo", "Bạn chưa chọn bản ghi nào");
    else {
        if (arrRowId.indexOf(',') > 0)
            titleDia = "Huỷ duyệt xuất bản các bản ghi đã chọn";
        else
            titleDia = "Huỷ duyệt xuất bản bản ghi đã chọn";
        $("#dialog-confirm").attr(titleDia);
        $("#dialog-confirm").html("<p><b>Bạn có chắc chắn muốn huỷ duyệt xuất bản:</b><br />" + rowTitle + "</p>");
        var comfirmReturn = false;
        $("#dialog-confirm").dialog({
            title: titleDia,
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: false,
            buttons: {
                "Tiếp tục": function () {
                    $(this).dialog("close");
                    $.post(encodeURI(urlPost), { "do": "publishingreject", "itemId": "" + arrRowId + "" }, function (data) {
                        if (data.Erros) {
                            createMessage("Có lỗi xảy ra", "<b>Lỗi được thông báo:</b><br/>" + data.Message);
                        }
                        else {
                            createMessage("Thông báo", data.Message);
                            window.location.href = urlFw + '&do=publishingreject&ItemID=' + arrRowId;
                        }
                    });
                },
                "Hủy lệnh huỷ duyệt xuất bản": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}
function escapeHTML(str) {
    var div = document.createElement('div');
    var text = document.createTextNode(str);
    div.appendChild(text);
    return div.innerHTML;
}


function trim12(str) {
    var str = str.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
}

function createCloseMessage(title, message, urlFw) {

    $("#dialog-message").html("<p>" + message + "</p>");
    $("#dialog-message").dialog({
        title: escapeHTML(title),
        resizable: true,
        height: 200,
        width: 360,
        modal: false,
        buttons: {
            "Đóng lại": function () {
                $(this).dialog("close");
                //alert($.address.value());
                window.location.href = '#' + $.address.value() + '&temp=' + Math.floor(Math.random() * 11);
            }
        }
    });
}

function createCloseMessage2(title, message, urlFw) {
    $("#dialog-message").html("<p>" + message + "</p>");
    $("#dialog-message").dialog({
        title: escapeHTML(title),
        resizable: true,
        height: 450,
        width: 720,
        modal: false,
        buttons: {
            "Đóng lại": function () {
                $(this).dialog("close");
                window.location.href = urlFw + '&temp=' + Math.floor(Math.random() * 11);
            }
        }
    });
}
function createCloseMessageRS(title, message) {
    $("#dialog-message").html("<p>" + message + "</p>");
    $("#dialog-message").dialog({
        title: escapeHTML(title),
        resizable: true,
        height: 450,
        width: 720,
        modal: false,
        buttons: {
            "Đóng lại": function () {
                $(this).dialog("close");

            }
        }
    });
}
// 
function createCloseMessage13(title, message, urlFw) {
    $("#dialog-message").html("<p>" + message + "</p>");
    $("#dialog-message").dialog({
        title: escapeHTML(title),
        resizable: true,
        height: 200,
        width: 360,
        modal: false,
        buttons: {
            "Đóng lại": function () {
                $(this).dialog("close");
                window.location.href = urlFw + '&temp=' + Math.floor(Math.random() * 11);
            }
        }
    });
}


function setRolesEdit(status) {
    if (status)
        $(".act_edit").css("display", "marker");
    else
        $(".act_edit").css("display", "none");
}

function setRolesDelete(status) {
    if (status)
        $(".act_delete").css("display", "marker");
    else
        $(".act_delete").css("display", "none");
}

function setRolesAdd(status) {
    if (status) {
        $(".act_add").removeClass("act_add_hidden");
        $(".act_add").css("display", "marker");
    }
    else
        $(".act_add").css("display", "none");
}

function setRolesApproved(status) {
    if (status)
        $(".act_approved").css("display", "marker");
    else
        $(".act_approved").css("display", "none");
}


function setRolesRoles(status) {
    if (status)
        $(".act_roles").css("display", "marker");
    else
        $(".act_roles").css("display", "none");
}

//Chuyển chuỗi kí tự (string) sang đối tượng Date()
function parseDate(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[1], mdy[0]);
}


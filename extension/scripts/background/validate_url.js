'use strict';

//Regular expression for url matching and validating, for more info visit http://jex.im/regulex/#!embed=false&flags=&re=((https%3F%3A%5C%2F%5C%2Fwww%5C.)%7C(https%3F%3A%5C%2F%5C%2F)%7C(www%5C.))(%5B0-9a-z%5C._-%5D%2B)((%5C.(aero%7Casia%7Cbiz%7Ccat%7Ccom%7Ccoop%7Cedu%7Cgov%7Cinfo%7Cint%7Cjobs%7Cmil%7Cmobi%7Cmuseum%7Cname%7Cnet%7Corg%7Cpro%7Ctel%7Ctravel%7Cac%7Cad%7Cae%7Caf%7Cag%7Cai%7Cal%7Cam%7Can%7Cao%7Caq%7Car%7Cas%7Cat%7Cau%7Caw%7Cax%7Caz%7Cba%7Cbb%7Cbd%7Cbe%7Cbf%7Cbg%7Cbh%7Cbi%7Cbj%7Cbm%7Cbn%7Cbo%7Cbr%7Cbs%7Cbt%7Cbv%7Cbw%7Cby%7Cbz%7Cca%7Ccc%7Ccd%7Ccf%7Ccg%7Cch%7Cci%7Cck%7Ccl%7Ccm%7Ccn%7Cco%7Ccr%7Ccu%7Ccv%7Ccx%7Ccy%7Ccz%7Ccz%7Cde%7Cdj%7Cdk%7Cdm%7Cdo%7Cdz%7Cec%7Cee%7Ceg%7Cer%7Ces%7Cet%7Ceu%7Cfi%7Cfj%7Cfk%7Cfm%7Cfo%7Cfr%7Cga%7Cgb%7Cgd%7Cge%7Cgf%7Cgg%7Cgh%7Cgi%7Cgl%7Cgm%7Cgn%7Cgp%7Cgq%7Cgr%7Cgs%7Cgt%7Cgu%7Cgw%7Cgy%7Chk%7Chm%7Chn%7Chr%7Cht%7Chu%7Cid%7Cie%7Cil%7Cim%7Cin%7Cio%7Ciq%7Cir%7Cis%7Cit%7Cje%7Cjm%7Cjo%7Cjp%7Cke%7Ckg%7Ckh%7Cki%7Ckm%7Ckn%7Ckp%7Ckr%7Ckw%7Cky%7Ckz%7Cla%7Clb%7Clc%7Cli%7Clk%7Clr%7Cls%7Clt%7Clu%7Clv%7Cly%7Cma%7Cmc%7Cmd%7Cme%7Cmg%7Cmh%7Cmk%7Cml%7Cmn%7Cmn%7Cmo%7Cmp%7Cmr%7Cms%7Cmt%7Cmu%7Cmv%7Cmw%7Cmx%7Cmy%7Cmz%7Cna%7Cnc%7Cne%7Cnf%7Cng%7Cni%7Cnl%7Cno%7Cnp%7Cnr%7Cnu%7Cnz%7Cnom%7Cpa%7Cpe%7Cpf%7Cpg%7Cph%7Cpk%7Cpl%7Cpm%7Cpn%7Cpr%7Cps%7Cpt%7Cpw%7Cpy%7Cqa%7Cre%7Cra%7Crs%7Cru%7Crw%7Csa%7Csb%7Csc%7Csd%7Cse%7Csg%7Csh%7Csi%7Csj%7Csj%7Csk%7Csl%7Csm%7Csn%7Cso%7Csr%7Cst%7Csu%7Csv%7Csy%7Csz%7Ctc%7Ctd%7Ctf%7Ctg%7Cth%7Ctj%7Ctk%7Ctl%7Ctm%7Ctn%7Cto%7Ctp%7Ctr%7Ctt%7Ctv%7Ctw%7Ctz%7Cua%7Cug%7Cuk%7Cus%7Cuy%7Cuz%7Cva%7Cvc%7Cve%7Cvg%7Cvi%7Cvn%7Cvu%7Cwf%7Cws%7Cye%7Cyt%7Cyu%7Cza%7Czm%7Czw%7Carpa))%7B1%2C2%7D(%5C%2F(%5B0-9a-z%5C._%5C-%5D%2B))*(%5C%2F(%5B%5C%2F%5Cw%5C.%5C-%5C%23%5C%3F%5C!%5C(%5C)%5C%3D%5C*%5C%25%5C%26%5D*))%3F)
var urlRegex = /((https?:\/\/www\.)|(https?:\/\/)|(www\.))([0-9a-z\._-]+)((\.(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)){1,2}(\/([0-9a-z\._\-]+))*(\/([\/\w\.\-\#\?\!\(\)\=\*\%\&]*))?)/;

var getDomain = function(url){
  return url.replace(urlRegex, '$5$7');
};

var getLinkWithoutQueryParams = function(url){
    return url.replace(urlRegex, '$5$7$9');
};

var getQueryParams = function (url){
  return url.replace(urlRegex, '$12');
};

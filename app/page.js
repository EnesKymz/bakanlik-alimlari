"use client"
import { useRef, useState } from "react";
import { Autocomplete, TextField, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DocumentIcon from '@mui/icons-material/Description';
import GovernmentIcon from '@mui/icons-material/AccountBalance';
import ArrowRightIcon from '@mui/icons-material/ArrowForward';
import Image from "next/image";

//bakanlıkların ismi ve sitelerini buraya ekliyoruz
const bakanliklar = [
    { label: "Adalet Bakanlığı", site: "https://www.adalet.gov.tr/arsiv?hl=tr",logo:"/assets/adaletbakanligi.jpg" },
    { label: "Sağlık Bakanlığı", site: "https://www.saglik.gov.tr/TR-99316/personel-duyurulari.html",logo:"/assets/saglikbakanligi.png" },
    { label: "Çevre Ve Şehircilik Bakanlığı", site: "https://personeldb.csb.gov.tr/duyurular",logo:"/assets/cevrevesehircilik.jpg" },
    {label:"Sanayi Ve Teknoloji Bakanlığı", site:"https://api.sanayi.gov.tr/api/Duyuru/GetDuyurular?adet=10&sayfa=1&yayinSekli=0",logo:"/assets/sanayiteknolojibakanligi.png"}
  ];

export default function BakanlikAlim() {
  const [announcementsDatas,setannouncementsData] = useState([])
  const loading = useRef()
  const [selectedBakanlik, setSelectedBakanlik] = useState(null);
  const [errorMessage,setErrorMessage] = useState(null);
    async function getDuyurular(value) {
      const getInformations =async() =>{
        try {
          setErrorMessage(null)
          setannouncementsData([])
          loading.current = true
          setSelectedBakanlik(value)
          //sanayi ve teknoloji bakanlığı haricinde aynı işlem olduğu için Adalet Bakanlığı içerisinde anlattım
          if(value.label ==="Adalet Bakanlığı"){
            //cors olduğu için api.corsproxy.io sitesi ile çekmeye çalışıyoruz
            const proxyUrl = "https://api.corsproxy.io/";
            const targetUrl =  value.site;
  
            fetch(proxyUrl + targetUrl,{
              headers:{
                //sitelerde yabancı dil de olduğu için türkçe çekmek istediğimizden Accept-Language tr-TR kullanıyoruz 
                'Accept-Language': 'tr-TR,tr;q=0.9',
              }
            })
            .then(response => response.text())
            .then(data => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, "text/html");        
          const announcementLinks = doc.querySelectorAll('#duyurular-tumu a.ab-announcement'); //#duyurular-tumu olan divin içine giriyoruz daha sonra <a ab-announcement içerisine giriyoruz>
          const announcements = []
          announcementLinks.forEach(link => {
            const titleElement = link.querySelector('h5.fw-bold');// burada başlıkları tarihleri ve departman adını çekiyoruz
            const dateElement = link.querySelector('.ab-announcement--time');
            const departmentElement = link.querySelector('.ab-content');
            
            if (titleElement && dateElement) {
              announcements.push({//verileri announcement listesine ekliyoruz
                title: titleElement.textContent.trim(),
                date: dateElement.textContent.trim(),
                department: departmentElement ? departmentElement.textContent.trim() : '',
                link: link.getAttribute('href')
              });
            }
            setannouncementsData(announcements) //verileri set edip returne gönderiyoruz
          });
            })
            .catch(error => console.error("Hata:", error));
          }
          if(value.label === "Sağlık Bakanlığı") {
            const proxyUrl = "https://api.corsproxy.io/";
            const targetUrl = value.site;
          
            fetch(`${proxyUrl}?url=${encodeURIComponent(targetUrl)}`, {
              headers: {
                'Accept-Language': 'tr-TR,tr;q=0.9',
              }
            })
            .then(response => response.text())
            .then(data => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(data, "text/html");
              
              // Düzeltilmiş selector
              const rows = doc.querySelectorAll('.bakanlik_haber_duyuru_listele_item tr');
              const announcements = [];
          
              rows.forEach(row => {
                const dateElement = row.querySelector('.haber_duyuru_date');
                const titleLink = row.querySelector('.bakanlik_haber_link');
                const departmentLink = row.querySelector('.bakanlik_haber_gm_link');
          
                // Tarih formatlama
                const day = dateElement?.querySelector('.date_01')?.textContent?.trim() || '';
                const month = dateElement?.querySelector('.date_02')?.textContent?.trim() || '';
                const year = dateElement?.querySelector('.date_03')?.textContent?.trim() || '';
                
                // Türkçe tarih formatı
                const turkceAylar = {
                  'Mar': 'Mart', 'Şub': 'Şubat' // Diğer ayları ekleyin
                };
                
                const announcement = {
                  title: titleLink?.textContent?.trim() || 'Başlık Yok',
                  link: titleLink?.getAttribute('href') || '#',
                  date: `${day} ${turkceAylar[month] || month} ${year}`,
                  department: departmentLink?.textContent?.trim() || 'Genel Müdürlük'
                };
                
                announcements.push(announcement);
              });
          
              console.log("Parsed Data:", announcements);
              setannouncementsData(announcements);
            })
            .catch(error => console.error("Hata:", error));
          }
          if(value.label ==="Çevre Ve Şehircilik Bakanlığı"){
            const proxyUrl = "https://api.corsproxy.io/";
            const targetUrl =  value.site;
  
            fetch(proxyUrl + targetUrl,{
              headers:{
                'Accept-Language': 'tr-TR,tr;q=0.9',
              }
            })
            .then(response => response.text())
            .then(data => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, "text/html");        
          const announcements = []
          const items = doc.querySelectorAll('.items .item');
          items.forEach(item => {
            const dateElements = item.querySelector('.date')?.querySelectorAll('strong');
            const linkElement = item.querySelector('a[href]');
            const titleElement = item.querySelector('.title');
            
            // Tarih formatlama (Gün Ay Yıl)
            const date = dateElements?.length === 3 
              ? `${dateElements[0].textContent.trim()} ${dateElements[1].textContent.trim()} ${dateElements[2].textContent.trim()}`
              : 'Tarih Belirtilmemiş';
          
            announcements.push({
              title: titleElement?.textContent.trim() || 'Başlık Yok',
              link: "https://personeldb.csb.gov.tr/"+(linkElement?.getAttribute('href') || '#'),
              date: date,
              // Eğer açıklama da gerekiyorsa:
              description: item.querySelector('.desc')?.textContent.trim() || ''
            });
          });
          setannouncementsData(announcements)
            })
            .catch(error => console.error("Hata:", error));
          }
          if(value.label ==="Sanayi Ve Teknoloji Bakanlığı"){
            //sanayi ve teknoloji bakanlığının apisinden verileri çekiyoruz
            const proxyUrl = "https://api.corsproxy.io/";
            const targetUrl =  value.site;
            const response = await fetch(targetUrl);
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jsonData = await response.json();
            const announcements = []
            for(const doc of jsonData){ //çektiğimiz JSON dosyasındaki listeleri ayrı ayrı çekip announcements listesine ekliyoruz
              let link;
              for(const doc2 of doc.pageContent.linkAddress){//girdiğimiz verinin içerisindeki link [0] içerisinde olduğu için for kullandık
                link = doc2.text
              }
              announcements.push({//announcements listesine ekliyoruz
                title:doc.text,
                date:doc.date,
                department:doc.note,
                link:("https://www.sanayi.gov.tr/"+link)||null,
              })
            }
            setannouncementsData(announcements)//set edip returne gönderiyoruz
          }
          } catch (error) {
              console.error("Hata oluştu:", error.message);
              setErrorMessage(error.message)
              return true;
          }finally{
            return true;
          }
      }
      const isGet =await getInformations() //async işlem olduğu için await ile çekiyoruz
      if(isGet) {
        loading.current= false //yüklendiyse loading = false yapıyoruz verileri gösteriyoruz
      }
   
  }
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-8">
      {/* Başlık ve Arama */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-indigo-900 mb-4">
          Kamu Duyuruları Takip Sistemi
        </h1>
        
        {/* Bakanlık Seçimi */}
        <div className="bg-white rounded-xl shadow-lg p-2 inline-block">
          <Autocomplete
            disablePortal
            options={bakanliklar}
            sx={{ 
              width: "20rem",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                padding: "8px"
              }
            }}
            onChange={(event, newValue) => getDuyurular(newValue)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Bakanlık Seçin" 
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <SearchIcon className="text-indigo-600 mr-2" />
                  )
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} className="hover:bg-indigo-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <GovernmentIcon className="text-indigo-600 mr-3" />
                  <span className="font-medium">{option.label}</span>
                </div>
              </li>
            )}
          />
        </div>
      </div>
    
      {/* Alımlar Listesi */}
      {selectedBakanlik && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-6">
              <Image 
                src={selectedBakanlik.logo} 
                alt={selectedBakanlik.label}
                width={36}
                height={36}
                className="w-16 h-16 mr-4 object-contain"
              />
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedBakanlik.label} Duyurular
              </h2>
            </div>
    
            {/* Duyurular Grid */}
            {!loading.current ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {
              !errorMessage ? (
              announcementsDatas.map((announcement, index) => (
                <div 
                  key={index}
                  className="group bg-gray-50 hover:bg-white rounded-xl p-6 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 hover:border-indigo-300"
                >
                  <div className="flex items-start mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <DocumentIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {announcement.date}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {announcement.content}
                  </div>
    
                  <div className="flex items-center justify-between">
                    {
                      announcement.department && ( <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {announcement.department||null }
                      </span>)
                    }
                   
                    <button onClick={()=>window.open(announcement.link,'_blank')} className="text-indigo-600 cursor-pointer hover:text-indigo-800 flex items-center">
                      Detaylı Görüntüle
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))
            ):(<div>{errorMessage}</div>)
              }
            </div>
            ) : (<CircularProgress/>)}
            
          </div>
        </div>
      )}
    </div>
  );
  
}
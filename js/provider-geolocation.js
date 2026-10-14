/* Georreferenciación adicional: no sustituye ningún campo del domicilio. */
(function (root) {
  'use strict';
  const FIELDS = ['Calle','Cp','Municipio','Entidad','Telefono','Email','Web'];
  const DEFAULT_CENTER = [19.2826,-99.6557];
  const MESSAGE = 'Debe ubicar y confirmar en el mapa la ubicación de este domicilio para continuar.';
  const empty = () => ({latitud:null,longitud:null,ubicacion_confirmada:false,fecha_confirmacion_ubicacion:null});
  const key = p => `${p}Georreferenciacion`;
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let mounted = [];
  let lastSearch = 0;
  const cache = new Map();
  const config = () => root.ProviderMapConfig || {};
  function valid(g) {
    return !!g && typeof g.latitud === 'number' && typeof g.longitud === 'number' &&
      Number.isFinite(g.latitud) && Number.isFinite(g.longitud) && Math.abs(g.latitud)<=90 && Math.abs(g.longitud)<=180;
  }
  function ensure(form) {
    ['fiscal','comercial'].forEach(p=>{form[key(p)] = {...empty(),...(form[key(p)] || {})};
      if (!valid(form[key(p)])) {form[key(p)].ubicacion_confirmada=false;form[key(p)].fecha_confirmacion_ubicacion=null;}
    });
    if (!['si','no'].includes(form.comercialMismoFiscal)) form.comercialMismoFiscal='no';
    sync(form);
    return form;
  }
  function sync(form) {
    if (form.comercialMismoFiscal!=='si') return;
    FIELDS.forEach(f=>{form[`comercial${f}`]=form[`fiscal${f}`] ?? '';});
    form.comercialGeorreferenciacion = {...(form.fiscalGeorreferenciacion || empty())};
  }
  function invalidate(form,p) {
    const g=form[key(p)] || (form[key(p)]=empty());
    g.ubicacion_confirmada=false;g.fecha_confirmacion_ubicacion=null;sync(form);
  }
  function position(form,p,lat,lng) {
    const g={...empty(),latitud:lat,longitud:lng};
    if (!valid(g)) return false;
    form[key(p)]=g;sync(form);return true;
  }
  function confirm(form,p) {
    if (!valid(form[key(p)])) return false;
    form[key(p)].ubicacion_confirmada=true;
    form[key(p)].fecha_confirmacion_ubicacion=new Date().toISOString();sync(form);return true;
  }
  function link(form) {form.comercialMismoFiscal='si';sync(form);}
  function unlink(form) {sync(form);form.comercialMismoFiscal='no';invalidate(form,'comercial');}
  function missing(form) {
    sync(form);
    return ['fiscal','comercial'].filter(p=>!valid(form[key(p)]) || form[key(p)].ubicacion_confirmada!==true);
  }
  function coordinates(g) {
    const known=valid(g);
    return `<div class="geo-coordinates"><span><b>Latitud:</b> <output data-geo-lat>${known?g.latitud.toFixed(6):'—'}</output></span><span><b>Longitud:</b> <output data-geo-lng>${known?g.longitud.toFixed(6):'—'}</output></span></div>`;
  }
  function status(g) {return valid(g)&&g.ubicacion_confirmada===true?'✓ Ubicación geográfica confirmada':'Ubicación pendiente de confirmar';}
  function html(p,form) {
    ensure(form);
    const g=form[key(p)],label=p==='fiscal'?'fiscal':'comercial';
    return `<section class="provider-geo" data-geo="${p}" aria-labelledby="geo-title-${p}"><h4 id="geo-title-${p}">Ubicación geográfica del domicilio ${label}</h4><p class="section-help">Ubique en el mapa la ubicación exacta de su domicilio ${label}. Puede buscar la dirección o mover el marcador para precisar la ubicación.</p><div class="geo-search"><label for="geo-search-${p}">Buscar dirección<input id="geo-search-${p}" data-geo-query placeholder="Se utilizarán los datos del domicilio capturado" autocomplete="off"></label><button type="button" class="btn btn-secondary" data-geo-search>Buscar dirección</button></div><small class="geo-search-info" data-geo-result role="status"></small><div class="provider-map" id="geo-map-${p}" aria-label="Mapa del domicilio ${label}"></div><p class="micro">Arrastre el marcador o haga clic en el inmueble. Con el marcador enfocado, use las flechas para ajustar su posición. La búsqueda no confirma la ubicación.</p><div class="geo-footer"><button type="button" class="btn btn-primary" data-geo-confirm ${valid(g)?'':'disabled'}>Confirmar ubicación</button><strong class="geo-status ${g.ubicacion_confirmada?'confirmed':'pending'}" data-geo-status role="status">${status(g)}</strong></div>${coordinates(g)}<small class="micro" data-geo-date>${g.fecha_confirmacion_ubicacion?'Confirmada: '+esc(new Date(g.fecha_confirmacion_ubicacion).toLocaleString('es-MX')):''}</small></section>`;
  }
  function commercialQuestion(form) {
    ensure(form);
    return `<fieldset class="geo-same-question"><legend>¿El domicilio comercial es el mismo que el domicilio fiscal?</legend><label class="check"><input type="radio" name="comercialMismoFiscal" value="si" ${form.comercialMismoFiscal==='si'?'checked':''}> Sí</label><label class="check"><input type="radio" name="comercialMismoFiscal" value="no" ${form.comercialMismoFiscal==='no'?'checked':''}> No</label></fieldset>`;
  }
  function linkedHtml(form) {
    const g=form.comercialGeorreferenciacion;
    return `<div class="geo-linked"><strong>✓ Domicilio comercial igual al domicilio fiscal</strong><p>Los datos y la ubicación permanecen vinculados al domicilio fiscal.</p><strong class="geo-status ${g.ubicacion_confirmada?'confirmed':'pending'}">${status(g)}</strong>${coordinates(g)}<small class="micro">${g.fecha_confirmacion_ubicacion?'Confirmada: '+esc(new Date(g.fecha_confirmacion_ubicacion).toLocaleString('es-MX')):''}</small><div class="actions"><button type="button" class="btn btn-secondary" data-edit-commercial>Editar domicilio comercial</button></div></div>`;
  }
  function dispose() {mounted.forEach(x=>{x.abort?.abort();x.map.remove();});mounted=[];}
  async function search(query,signal) {
    if (cache.has(query)) return cache.get(query);
    if (Date.now()-lastSearch<1100) throw Error('Espere un momento antes de realizar otra búsqueda.');
    lastSearch=Date.now();
    const url=new URL(config().geocoderUrl || 'https://photon.komoot.io/api/');
    url.searchParams.set('q',query);url.searchParams.set('limit','5');
    url.searchParams.set('lat',String(DEFAULT_CENTER[0]));url.searchParams.set('lon',String(DEFAULT_CENTER[1]));
    const response=await fetch(url,{signal,credentials:'omit'});
    if (!response.ok) throw Error('La búsqueda no está disponible. Puede ubicar el inmueble manualmente en el mapa.');
    const data=await response.json();
    const features=(data.features||[]).filter(x=>x.geometry?.type==='Point'&&valid({latitud:x.geometry.coordinates[1],longitud:x.geometry.coordinates[0]}));
    cache.set(query,features);return features;
  }
  function mount(rootEl,form,{save,capture,rerender}) {
    ensure(form);
    rootEl.querySelectorAll('[name="comercialMismoFiscal"]').forEach(input=>input.addEventListener('change',()=>{
      capture();if(input.value==='si')link(form);else unlink(form);save();rerender();
    }));
    rootEl.querySelector('[data-edit-commercial]')?.addEventListener('click',()=>{capture();unlink(form);save();rerender();});
    FIELDS.forEach(field=>{
      const fiscal=rootEl.querySelector(`[name="fiscal${field}"]`);
      const commercial=rootEl.querySelector(`[name="comercial${field}"]`);
      if(commercial&&form.comercialMismoFiscal==='si')commercial.readOnly=true;
      ['fiscal','comercial'].forEach(p=>{rootEl.querySelector(`[name="${p}${field}"]`)?.addEventListener('input',()=>{
        capture();if(['Calle','Cp','Municipio','Entidad'].includes(field))invalidate(form,p);sync(form);save();
        if (form.comercialMismoFiscal==='si') {
          FIELDS.forEach(f=>{const el=rootEl.querySelector(`[name="comercial${f}"]`);if(el)el.value=form[`comercial${f}`];});
          const linked=rootEl.querySelector('.geo-linked');if(linked){const box=document.createElement('div');box.innerHTML=linkedHtml(form);linked.replaceWith(box.firstElementChild);rootEl.querySelector('[data-edit-commercial]').onclick=()=>{capture();unlink(form);save();rerender();};}
        }
        mounted.filter(x=>x.root===rootEl).forEach(x=>x.update());
      });});
      if(fiscal&&commercial&&form.comercialMismoFiscal==='si')commercial.value=fiscal.value;
    });
    rootEl.querySelectorAll('[data-geo]').forEach(section=>{
      const p=section.dataset.geo,container=section.querySelector('.provider-map');
      if (!root.L) {container.textContent='No se pudo cargar la biblioteca del mapa. Recargue la página.';return;}
      const g=form[key(p)],known=valid(g),center=known?[g.latitud,g.longitud]:DEFAULT_CENTER;
      const map=root.L.map(container,{scrollWheelZoom:false}).setView(center,known?17:13);
      const tile=root.L.tileLayer(config().tileUrl || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);
      let warned=false;
      tile.on('tileerror',()=>{if(!warned){section.querySelector('[data-geo-result]').textContent='No se pudo cargar la cartografía. Compruebe su conexión antes de confirmar la ubicación.';warned=true;}});
      const marker=root.L.marker(center,{draggable:true,autoPan:true,title:`Ubicación del domicilio ${p}; arrastre para ajustar`}).addTo(map);
      const record={root:rootEl,map,marker,abort:null,update:()=>{
        const current=form[key(p)];
        const confirmed=valid(current)&&current.ubicacion_confirmada===true;
        const statusEl=section.querySelector('[data-geo-status]');statusEl.textContent=status(current);statusEl.className=`geo-status ${confirmed?'confirmed':'pending'}`;
        section.querySelector('[data-geo-confirm]').disabled=!valid(current);
        section.querySelector('[data-geo-lat]').textContent=valid(current)?current.latitud.toFixed(6):'—';
        section.querySelector('[data-geo-lng]').textContent=valid(current)?current.longitud.toFixed(6):'—';
        section.querySelector('[data-geo-date]').textContent=confirmed&&current.fecha_confirmacion_ubicacion?'Confirmada: '+new Date(current.fecha_confirmacion_ubicacion).toLocaleString('es-MX'):'';
      }};
      mounted.push(record);
      const persistPosition=point=>{position(form,p,point.lat,point.lng);save();record.update();
        if(form.comercialMismoFiscal==='si'){const linked=rootEl.querySelector('.geo-linked');if(linked){const box=document.createElement('div');box.innerHTML=linkedHtml(form);linked.replaceWith(box.firstElementChild);rootEl.querySelector('[data-edit-commercial]').onclick=()=>{capture();unlink(form);save();rerender();};}}
      };
      marker.on('dragstart',()=>{invalidate(form,p);save();record.update();});
      marker.on('drag',()=>persistPosition(marker.getLatLng()));
      marker.on('dragend',()=>persistPosition(marker.getLatLng()));
      map.on('click',e=>{marker.setLatLng(e.latlng);persistPosition(e.latlng);});
      marker.getElement()?.addEventListener('keydown',e=>{
        const directions={ArrowUp:[-8,0],ArrowDown:[8,0],ArrowLeft:[0,-8],ArrowRight:[0,8]};
        if(!directions[e.key])return;e.preventDefault();e.stopPropagation();
        const [dy,dx]=directions[e.key],pt=map.latLngToContainerPoint(marker.getLatLng()),ll=map.containerPointToLatLng([pt.x+dx,pt.y+dy]);marker.setLatLng(ll);persistPosition(ll);
      });
      section.querySelector('[data-geo-confirm]').onclick=()=>{capture();if(confirm(form,p)){save();record.update();
        if(form.comercialMismoFiscal==='si')rerender();
      }};
      const queryInput=section.querySelector('[data-geo-query]');
      queryInput.value=['Calle','Cp','Municipio','Entidad'].map(f=>form[`${p}${f}`]).filter(Boolean).join(', ');
      queryInput.dataset.prefill=queryInput.value;
      const searchBtn=section.querySelector('[data-geo-search]');
      queryInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();searchBtn.click();}});
      searchBtn.onclick=async()=>{
        capture();const fromAddress=['Calle','Cp','Municipio','Entidad'].map(f=>form[`${p}${f}`]).filter(Boolean).join(', ');
        if(!queryInput.value.trim()||queryInput.value===queryInput.dataset.prefill){queryInput.value=fromAddress;queryInput.dataset.prefill=fromAddress;}
        const query=queryInput.value.trim();
        const resultEl=section.querySelector('[data-geo-result]');
        if(!query){resultEl.textContent='Capture una dirección o utilice el mapa para ubicar el inmueble.';return;}
        record.abort?.abort();record.abort=new AbortController();const timeout=setTimeout(()=>record.abort.abort(),12000);
        searchBtn.disabled=true;resultEl.textContent='Buscando dirección…';
        try {
          const results=await search(query,record.abort.signal);
          if(!container.isConnected)return;
          if(!results.length){resultEl.textContent='No se encontró la dirección. Refine su búsqueda o coloque el marcador manualmente.';return;}
          const choose=feature=>{
            const [lng,lat]=feature.geometry.coordinates;marker.setLatLng([lat,lng]);map.setView([lat,lng],17);persistPosition({lat,lng});
            const props=feature.properties||{};resultEl.textContent=['name','street','housenumber','city','state','country'].map(k=>props[k]).filter(Boolean).join(', ')+' · Verifique el inmueble y confirme la ubicación.';
          };
          choose(results[0]);
          if(results.length>1){const options=document.createElement('select');options.setAttribute('aria-label','Resultados de búsqueda de dirección');results.forEach((feature,n)=>{const option=document.createElement('option');option.value=String(n);const props=feature.properties||{};option.textContent=['name','street','housenumber','city','state','country'].map(k=>props[k]).filter(Boolean).join(', ');options.append(option);});options.onchange=()=>{const selected=results[Number(options.value)];choose(selected);resultEl.append(options);};resultEl.append(options);}
        }catch(error){if(container.isConnected)resultEl.textContent=error.name==='AbortError'?'La búsqueda tardó demasiado. Intente otra vez o seleccione la ubicación en el mapa.':error.message||'No se pudo buscar. Seleccione la ubicación en el mapa.';}
        finally{clearTimeout(timeout);searchBtn.disabled=false;}
      };
      requestAnimationFrame(()=>{if(container.isConnected)map.invalidateSize();});
      record.update();
    });
  }
  const api={FIELDS,MESSAGE,empty,valid,ensure,sync,invalidate,position,confirm,link,unlink,missing,html,commercialQuestion,linkedHtml,mount,dispose};
  root.ProviderGeolocation=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);

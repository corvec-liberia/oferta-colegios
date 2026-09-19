'use strict';
const data = window.CORVEC_DATA;
const $ = s => document.querySelector(s);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const areaById = Object.fromEntries(data.areas.map(a => [a.id, a]));
const schoolById = Object.fromEntries(data.schools.map(s => [s.id, s]));
const records = data.schools.flatMap(s => s.offers.map(o => ({...o, school:s})));
let limit = 12;
let previousFocus;
const dialog = $('#detail');
const partnerships = [
 ['01','Práctica profesional','Abra un espacio para aplicar conocimientos en un entorno real de trabajo.'],
 ['02','Pasantías','Comparta experiencias que acerquen a estudiantes al mundo laboral.'],
 ['03','Formación dual','Explore una formación compartida entre la empresa y el centro educativo.'],
 ['04','Giras empresariales','Muestre sus procesos, instalaciones y oportunidades profesionales.'],
 ['05','Charlas técnicas','Comparta la experiencia de su equipo con estudiantes y docentes.'],
 ['06','Equipo y materiales','Apoye el aprendizaje en talleres y laboratorios.'],
 ['07','Proyectos conjuntos','Desarrolle iniciativas junto con la comunidad educativa.'],
 ['08','Visitas institucionales','Conozca el centro y converse sobre nuevas formas de colaboración.']
];
function logo(s){return s.logo ? `<img class="school-logo" src="${s.logo}" alt="Escudo de ${esc(s.name)}" loading="lazy">` : `<span class="school-initial" aria-hidden="true">${s.id === 'tilaran' ? 'CT' : 'TR'}</span>`;}
$('#area-grid').innerHTML=data.areas.map((a,i)=>`<button type="button" class="area-card" data-area="${a.id}" aria-label="Explorar ${esc(a.name)}"><img src="${a.image}" alt="" loading="lazy"><div><small>ÁREA ${String(i+1).padStart(2,'0')}</small><h3>${esc(a.name)}</h3><p>${esc(a.description)}</p><span class="arrow" aria-hidden="true">↗</span></div></button>`).join('');
$('#schools').innerHTML=data.schools.map((s,i)=>`<article class="school-card"><div class="school-top">${logo(s)}<span class="index">${String(i+1).padStart(2,'0')} / 09</span></div><h3>${esc(s.name)}</h3><p class="school-location">${esc(s.location)}</p><div class="school-meta"><span><strong>${s.count}</strong> especialidades</span><button class="card-link" data-school="${s.id}" aria-label="Conocer la oferta de ${esc(s.name)}">Conocer oferta ↗</button></div></article>`).join('');
$('#school-filter').innerHTML+=data.schools.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('');
$('#area-filter').innerHTML+=data.areas.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join('');
$('#partnerships').innerHTML=partnerships.map(([n,t,d])=>`<button class="partnership" data-partnership="${esc(t)}"><span class="symbol">${n} ↗</span><h3>${t}</h3><p>${d}</p><span class="more">CONVERSAR CON UN CENTRO →</span></button>`).join('');
function renderResults(){
 const q=normalize($('#query').value.trim());
 const school=$('#school-filter').value, area=$('#area-filter').value, mode=$('#mode-filter').value;
 const matches=records.filter(r=>(!school||r.school.id===school)&&(!area||r.area===area)&&(!mode||r.mode===mode)&&(!q||normalize(r.name+' '+r.school.name+' '+r.school.location).includes(q)));
 $('#result-count').textContent=`${matches.length} ${matches.length===1?'oferta encontrada':'ofertas encontradas'} · por centro y jornada`;
 $('#results').innerHTML=matches.length?matches.slice(0,limit).map(r=>`<article class="offer"><small>${esc(areaById[r.area].short)}</small><h3>${esc(r.name)}</h3><p class="schoolname">${esc(r.school.name)}</p><p class="period">${esc(r.school.period)}</p><div class="offer-bottom"><span class="pill ${r.mode==='Nocturna'?'night':''}">${r.mode==='Nocturna'?'☾':'☀'} ${r.mode}</span><button class="card-link" data-school="${r.school.id}" aria-label="Ver centro ${esc(r.school.name)} para ${esc(r.name)}, jornada ${r.mode}">Ver centro ↗</button></div></article>`).join(''):'<div class="empty"><h3>No encontramos coincidencias.</h3><p>Pruebe con otra palabra o quite uno de los filtros.</p></div>';
 $('#load').hidden=matches.length<=limit;
}
$('#filters').addEventListener('submit',e=>e.preventDefault());
$('#filters').addEventListener('input',()=>{limit=12;renderResults();});
$('#filters').addEventListener('change',()=>{limit=12;renderResults();});
$('#reset').addEventListener('click',()=>{$('#filters').reset();limit=12;renderResults();});
$('#load').addEventListener('click',()=>{limit+=12;renderResults();});
$('#menu').addEventListener('click',()=>{const open=$('#nav').classList.toggle('open');$('#menu').setAttribute('aria-expanded',open);$('#menu').setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
$('#nav').addEventListener('click',e=>{if(e.target.closest('a')){$('#nav').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');$('#menu').setAttribute('aria-label','Abrir menú');}});
function showDialog(html){previousFocus=document.activeElement;$('#dialog-content').innerHTML=html;if(!dialog.open)dialog.showModal();dialog.scrollTop=0;$('.close').focus();}
$('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{if(previousFocus?.isConnected)previousFocus.focus();});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function offerColumns(day,night){return `<div class="dialog-columns"><div><h3>☀ Jornada diurna</h3><ul>${day.map(n=>`<li>${esc(n)}</li>`).join('')}</ul></div><div><h3>☾ Jornada nocturna</h3><ul>${night.map(n=>`<li>${esc(n)}</li>`).join('')}</ul></div></div>`;}
function contactCards(s,topic='Vinculación empresarial'){
 if(!s.contacts.length)return '<p class="note">Los insumos de este centro no incluyen un contacto. Su información se incorporará cuando esté disponible.</p>';
 return `<div class="contact-list">${s.contacts.map(c=>`<div class="contact-card"><strong>${esc(c.name)}</strong><p>${esc(c.role)}</p>${c.email?`<a href="mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent(topic+' · CORVEC')}" aria-label="Escribir a ${esc(c.name)}">${esc(c.email)}</a>`:''}${c.phone?`<a href="tel:+506${c.phone.replace(/\D/g,'')}">+506 ${esc(c.phone)}</a>`:''}${!c.email&&!c.phone?'<p>Correo y teléfono no incluidos en el insumo.</p>':''}</div>`).join('')}</div>`;
}
function showSchool(id){
 const s=schoolById[id];if(!s)return;
 showDialog(`<div class="dialog-title-row">${logo(s)}<div><h2 id="dialog-title">${esc(s.name)}</h2><p>${esc(s.location)} · ${esc(s.period)}</p></div></div>${s.note?`<p class="note">${esc(s.note)}</p>`:''}${offerColumns(s.day,s.night)}${s.offer2027?`<details><summary>Ver oferta específica de 2027 (según la presentación)</summary>${offerColumns(s.offer2027.day,s.offer2027.night)}</details>`:''}<h3>Conecte con este centro</h3>${contactCards(s)}<p class="source">Fuente: ${esc(s.source)}. Datos transcritos de los insumos institucionales recibidos. Las fotografías del portal son ilustrativas.</p>`);
}
function showContact(topic='Vinculación empresarial'){
 showDialog(`<p class="eyebrow">UNA ALIANZA EMPIEZA CON UNA CONVERSACIÓN</p><h2 id="dialog-title">${esc(topic)}</h2><p class="request-help">Seleccione un centro y contacte a su equipo. El botón prepara un correo en su aplicación de correo; el portal no envía mensajes automáticamente.</p><form class="request-form" id="request-form"><label>Centro educativo<select id="request-school" required><option value="">Seleccione un centro</option>${data.schools.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></label><div id="contact-preview" aria-live="polite"></div><div id="email-fields" hidden><label>Contacto destinatario<select id="request-recipient"></select></label><label>Nombre de su empresa<input id="company" maxlength="120" autocomplete="organization"></label><label>Nombre de contacto<input id="person" maxlength="120" autocomplete="name"></label><p class="request-help">Puede completar el mensaje y sus datos de contacto antes de enviarlo desde su correo.</p><button class="button dark" type="submit">Preparar correo <span>↗</span></button></div></form>`);
 $('#request-school').addEventListener('change',()=>{
  const s=schoolById[$('#request-school').value];const fields=$('#email-fields');
  if(!s){$('#contact-preview').innerHTML='';fields.hidden=true;return;}
  $('#contact-preview').innerHTML=contactCards(s,topic);
  const contacts=s.contacts.filter(c=>c.email);
  fields.hidden=!contacts.length;
  $('#request-recipient').innerHTML=contacts.map(c=>`<option value="${esc(c.email)}">${esc(c.name)} · ${esc(c.role)}</option>`).join('');
 });
 $('#request-form').addEventListener('submit',e=>{
  e.preventDefault();const email=$('#request-recipient').value;if(!email)return;
  const s=schoolById[$('#request-school').value];
  const body=`Saludos al equipo de ${s.name}:\n\nMi nombre es ${$('#person').value.trim()||'[nombre]'}, de la empresa ${$('#company').value.trim()||'[empresa]'}.\n\nNos interesa conversar sobre ${topic.toLowerCase()} y conocer las posibilidades de colaboración con su centro educativo.\n\nDatos para contactarnos:\nTeléfono: \nCorreo: \n\nMuchas gracias.`;
  window.location.href=`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(topic+' · CORVEC')}&body=${encodeURIComponent(body)}`;
 });
}
document.addEventListener('click',e=>{
 const school=e.target.closest('[data-school]');if(school)showSchool(school.dataset.school);
 const a=e.target.closest('[data-area]');if(a){$('#filters').reset();$('#area-filter').value=a.dataset.area;limit=12;renderResults();$('#oferta').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});$('#area-filter').focus({preventScroll:true});}
 const p=e.target.closest('[data-partnership]');if(p)showContact(p.dataset.partnership);
});
$('#open-contact').addEventListener('click',()=>showContact());
$('#credits').addEventListener('click',()=>showDialog(`<h2 id="dialog-title">Fuentes y créditos</h2><p class="selected-field">Oferta consolidada a partir de diez documentos institucionales recibidos el 19 de septiembre de 2026. Se conservan las jornadas y el período de cada fuente.</p><ul class="credits-list">${data.schools.map(s=>`<li><strong>${esc(s.name)}</strong>: ${esc(s.source)}</li>`).join('')}</ul><p class="note">Las fotografías son ilustrativas: no corresponden a instalaciones o estudiantes de los centros de esta red. Los escudos disponibles fueron extraídos de los insumos; la marca tipográfica CORVEC es provisional y no sustituye su escudo oficial.</p><h3 class="selected-field">Fotografías · Pexels</h3><ul class="credits-list"><li><a href="https://www.pexels.com/photo/5306450/" target="_blank" rel="noopener">Portada — Antoni Shkraba</a></li><li><a href="https://www.pexels.com/photo/5212687/" target="_blank" rel="noopener">Educación y tecnología — Max Fischer</a></li><li><a href="https://www.pexels.com/photo/9242855/" target="_blank" rel="noopener">Industria — Mikhail Nilov</a></li><li><a href="https://www.pexels.com/photo/2544829/" target="_blank" rel="noopener">Gastronomía — Rene Terp</a></li><li><a href="https://www.pexels.com/photo/4344116/" target="_blank" rel="noopener">Administración — Edmond Dantès</a></li><li><a href="https://www.pexels.com/photo/10326925/" target="_blank" rel="noopener">Agricultura — Swastik Arora</a></li><li><a href="https://www.pexels.com/photo/1108101/" target="_blank" rel="noopener">Seguridad en el trabajo — Chevanon Photography</a></li></ul><p class="request-help">Las áreas son una agrupación de navegación del portal, no una clasificación oficial de los planes de estudio. Se normalizaron mayúsculas, tildes y errores tipográficos evidentes; las denominaciones de planes distintos se conservaron.</p>`));
renderResults();


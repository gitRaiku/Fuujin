<script>
export let clicker
function clickBack() {clicker('trans')}
function clickFw() {clicker('nodes')}
</script>
<div class="flex flex-row items-center justify-center">
  <div class="max-w-300 w-full">
    <div class="text-6xl font-bold mb-4 w-full">Introducere</div>

    <div class="text-lg mb-6 w-full">
      Fuujin este un <span class="font-bold">Radio Definit prin Software(SDR)</span> orientat incepatorilor.
    </div>

    <div class="text-6xl font-bold mb-4">De unde a aparut Fuujin</div>

    <div class="text-lg mb-6">Acest proiect a aparut din lipsa unei metode accesibile de a interactiona cu sisteme radio.</div>
    <div class="text-lg mb-6">Majoritatea uneltelor, desi versatile si puternice, sunt greu de folosit si necesita o familiaritate crescuta cu procesarea semnalelor. De aceea acest SDR a fost conceput sa fie cat de prietenos incepatorilor, oferind documentatie ampla asupra conceptelor de baza regasite in sistemele de radio moderne.</div>

    <div class="text-6xl font-bold mb-4">Cum functioneaza Fuujin</div>
    <div class="text-lg mb-6">
      Fuujin este fundamental bazat pe algoritmul de <b>Transforma Fourier Rapida(FFT)</b>, algoritm ce trebuie rulat de aproximativ 200 de ori pe secunda pentru a putea mentine calitatea sunetului procesat. Din cauza acestei limitari, Fuujin foloseste libraria <a href="https://github.com/mborgerding/kissfft" class="underline">KissFFT</a> scrisa in limbajul de programare C, compilata in Web Assembly folosind <a href="https://emscripten.org/" class="underline">Emscripten</a>, oferindu-i astfel viteza necesara.
    </div>
    <div class="text-lg mb-6">
      Majoritatea procesarii datelor se intampla aici, in browser, in frontendul scris in Svelte impreuna cu Tailwind css. Exista totusi si un server de backend scris in python, ce comunica cu toti clientii conectati folosind WebSocketuri pentru a putea distribui informatia despre eterul radio in timp real.
    </div>

    <div class="text-6xl font-bold mb-4">Inspiratie</div>
    <div class="text-lg mb-6">
      Iar cum trebuie sa existe inspiratii pentru tot, acest proiect a fost in mare parte inspirat de proiectul open-source <a href="https://www.gnuradio.org/" class="underline">GnuRadio</a>, care m-a invatat prima oara sa lucrez cu date destinate radioului.
    </div>
    <div class="text-lg mb-6">
      De asemenea, inspiratia pentru nume mi-a venit de la zeul japonez Fuujin 風神 care este spus sa fie domnitorul vanturile, astfel controland atmosfera pamantului, atmosfera ce ne permite sa respiram, dar care ne permite si sa trimitem semnale.
    </div>

    <div class="flex flex-column items-center justify-center min-h-20 mt-8">
      <div class="w-[30%] border text-center min-h-20 hover:border-primary hover:cursor-pointer rounded-md transition-all duration-200 mr-[40%] hidden" on:click={clickBack}>
      </div>

      <div class="w-[30%] border text-center min-h-20 hover:border-primary hover:cursor-pointer rounded-md transition-all duration-200" on:click={clickFw}>
        <div class="flex flex-col items-right justify-right p-3">
          <div class="text-right item-center text-secondary">Pagina Urmatoare</div>
          <div class="text-right item-center">Tipurile de noduri</div>
        </div>
      </div>
    </div>
  </div>
</div>


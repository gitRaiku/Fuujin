<script>
export let clicker
function clickBack() {clicker('trans')}
function clickFw() {clicker('fft')}
</script>
<div class="flex flex-row items-center justify-center">
  <div class="max-w-300 w-full">
    <div class="text-6xl font-bold mb-4 w-full">Semnale si unde electromagnetice</div>

    <div class="text-lg mb-6 w-full">
      Pentru a putea incepe a intelege ce este acela un radio, trebuie mai intai sa definim baza pe care este acesta fondat, adica semnalele. Un semnal este rezultatul afectarii unui mediu pentru a transmite informatie. Desi vaga definitia, aceasta encapsuleaza foarte bine o intuitie despre semnale, aceea ca nu conteaza mediul prin care se transmite informatia, putand fi radio, electric, pe internet sau chiar pe foaie, dar nici metoda de codificare a informatiei.
    </div>

    <div class="text-6xl font-bold mb-4">Semnale Audio</div>
    <div class="text-lg mb-6">Semnalele audio contin informatii despre frecventele dintre 20Hz si 20kHz, acestea fiind percepute ca si sunet de catre urechea umana.</div>
    <div class="text-lg mb-6">Informatia despre ce frecvente sunt prezente in semnal poate fi codificata, in general, prin doua metode, acestea fiind semnalul in domeniul timpului, si semnalul in domeniul frecventelor</div>
    <div class="text-lg mb-6">Cel mai simplu dintre acestea este domeniul timpului, fiind si mai intuitiv de inteles pentru noi, privind semnalul in acest domeniu il putem vedea ca o serie de valori ce codifica intensitatea acestuia intr-un moment dat in timp.</div>
    <div class="text-lg mb-6">Pentru a putea lucra cu acest stil de date caci in forma lui reala are informatie infinita, fapt ce calculatoarele nu prea apreciaza, acesta trebuie cuantificat, fiind esantionat la cu o rata fixa numita rata de esantionare. Aceasta rata defineste simultan si cantitatea de informatie pastrata in datele rezultante. Acest fapt reiese din teorema lui Nyquist: pentru o frecventa <i>f</i> de esantionare, frecventa maxima a semnalului original care poate fi reconstruita este <i>f/2</i>.</div>

    <div class="flex flex-column items-center justify-center min-h-20 mt-8">
      <div class="w-[30%] border text-center min-h-20 hover:border-primary hover:cursor-pointer rounded-md transition-all duration-200 mr-[40%]" on:click={clickBack}>
        <div class="flex flex-col items-left justify-left p-3">
          <div class="text-left item-center text-secondary">Pagina Trecuta</div>
          <div class="text-left item-center">Eterul</div>
        </div>
      </div>

      <div class="w-[30%] border text-center min-h-20 hover:border-primary hover:cursor-pointer rounded-md transition-all duration-200" on:click={clickFw}>
        <div class="flex flex-col items-right justify-right p-3">
          <div class="text-right item-center text-secondary">Pagina Urmatoare</div>
          <div class="text-right item-center">Ce este un FFT</div>
        </div>
      </div>
    </div>
  </div>
</div>



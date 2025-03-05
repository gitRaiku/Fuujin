<script>
export let clicker
function clickBack() {clicker('semnal')}
function clickFw() {clicker('semnal')}
</script>
<div class="flex flex-row items-center justify-center">
  <div class="max-w-300 w-full">
    <div class="text-6xl font-bold mb-4 w-full">Domeniul frecventei</div>

    <div class="text-lg mb-6 w-full">
      A doua metoda de a reprezenta semnalele, este de a le prezenta in domeniul frecventei.
    </div>

    <div class="text-lg mb-6 w-full">
      Acesta este mai greu de inteles intuitiv, caci acesta nu reprezinta un punct instantaneu in timp, cu ar fi fost un esantion din domeniul timpului, ci acesta reprezinta o colectie de frecvente, cat si diferenta lor de faza pe o perioada finita de timp. 
    </div>
    <div class="text-lg mb-6 w-full">
      Pentru a putea lucra cu aceasta, considerand ca semnalele reale sunt in general reprezentate in domeniul timpului, suntem obligati a lua transforma fourier a semnalului. Aceasta calculeaza ce frecvente sunt prezenta in colectia de esantioane data.
    </div>
    <div class="text-lg mb-6 w-full">
      Cum transforma fourier matematica este definita iarasi pe o infinitate de puncte, noi suntem fortati sa folosim un algoritm numit o Transforma Fourier Rapida, care extrage informatiile necesare dintr-o selectie de valori echidistante in timp, rezultand intr-o selectie de valori echidistante in frecventa.
    </div>

    <div class="flex flex-column items-center justify-center min-h-20 mt-8">
      <div class="w-[30%] border text-center min-h-20 hover:border-primary hover:cursor-pointer rounded-md transition-all duration-200 mr-[40%]" on:click={clickBack}>
        <div class="flex flex-col items-left justify-left p-3">
          <div class="text-left item-center text-secondary">Pagina Trecuta</div>
          <div class="text-left item-center">Ce este un semnal</div>
        </div>
      </div>

      <div class="w-[30%] border text-center min-h-20 hover:border-primary hover:cursor-pointer rounded-md transition-all duration-200 hidden" on:click={clickFw}>
      </div>
    </div>
  </div>
</div>



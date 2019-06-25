setTimeout(()=>{
	$('section.main h1').removeClass('opacity')
	$('section.main h1').on('transitionend', ()=>{
		$('section.main h2').removeClass('opacity')
		$('section.main h2').on('transitionend', ()=>{
			$('section.main h1').removeClass('transformed')
			$('section.main h2').removeClass('transformed')
			$('section.main .console').removeClass('transformed')
			$('header').removeClass('transformed')
		})
	})
	console.log('1')
}, 1000)
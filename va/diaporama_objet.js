// Diaporama
// Version : 6.04.03
//
// http://so.fun.free.fr

	if (monDiaporama == null)
	{
		var monDiaporama = new Array();
	}

	function Diaporama(id_diaporama, frequenceH, vitesseH,	delai, largeurMax, hauteurMax, typeTransition)
	{
		this.id_diaporama = id_diaporama;

		this.diapo = new Array();

		this.calque1 = "";
		this.calque2 = "";

		this.frequenceH = frequenceH;
		this.vitesseH = vitesseH;
		this.delai = delai; // délai entre chaque rotations

		this.largeurMax = largeurMax;
		this.hauteurMax = hauteurMax;

		this.indexDiapo = 2;
		this.masquePanneauCommande = false;
		this.epaisseurCadre = 0;
		this.couleurCadre = "#000000";

		if (!typeTransition) // slide ou flou
		{
			this.typeTransition = "slide";
		}
		else
		{
			this.typeTransition = "flou";
		}

		this.stats = new Image();
		this.stats.src = "http://so.fun.free.fr/modules/stats/image_bidon.php?script=diaporama&version=6.04.03";

	}

	function ajoutePhoto(url_photo)
	{
		nb_diapo = this.diapo.length;
		this.diapo[nb_diapo] = new Image();
		this.diapo[nb_diapo].src = url_photo;
	}

	function progressionChangeDiapoH()
	{
		if (this.calque1.offsetWidth > 0)
		{
			if ( (this.calque1.offsetWidth - this.vitesseH) < 0)
			{
				this.calque1.style.width = "0px";
			}
			else
			{
				this.calque1.style.width = (this.calque1.offsetWidth - this.vitesseH) + "px";
			}
			setTimeout("monDiaporama[" + this.id_diaporama + "].progressionChangeDiapoH()", this.frequenceH);
		}
		else
		{	// inversion des calques
			this.calque1.style.zIndex = 1; // le calque écrasé passe au dessous
			this.calque2.style.zIndex = 2; // le calque visible passe au dessus
			this.calque1.style.width = this.largeurMax + "px"; // le calque du dessous reprends sa taille initiale

			// Mise en place d'une nouvelle image dans le calque qui se trouve en arrière
			this.calque1.style.backgroundImage = "url('" + this.diapo[this.indexDiapo].src + "')";
			this.indexDiapo++;
			if (this.indexDiapo >= this.diapo.length) this.indexDiapo = 0;

			//inversion des références des calques car seul calque1 rétrécit
			calqueTemp = this.calque2;
			this.calque2 = this.calque1;
			this.calque1 = calqueTemp;

			if ( !(document.getElementById('cb_defilement_' + this.id_diaporama)) || document.getElementById('cb_defilement_' + this.id_diaporama).checked )
			{
				setTimeout("monDiaporama[" + this.id_diaporama + "].progressionChangeDiapoH()", this.delai);
			}
			else
			{
				setTimeout("monDiaporama[" + this.id_diaporama + "].pause()", this.delai);
			}
		}
	}

	function progressionChangeDiapoFlou()
	{
		this.vitesse = this.vitesseH;
		this.frequence = this.frequenceH;

		if (this.calque1.style.opacity > 0)
		{// disparition de l'image du dessus
			// pour Firefox (le paramètre existe sous IE mais n'a pas d'influence)
			// ce paramètre sert de base commune pour les deux navigateurs pour tester l'état du calque
			opacite = parseFloat(this.calque1.style.opacity) - parseFloat(this.vitesse / 100);
			if (opacite < 0)
			{
				opacite=0;
			}
			this.calque1.style.opacity = opacite

			// pour IE
			if (this.calque1.style.filter)
			{
				texte = this.calque1.style.filter;
				opacite = texte.replace(/alpha\(opacity=([0-9]*)\)/, '$1');
				opacite = parseFloat(opacite) - this.vitesse;
				if (opacite < 0)
				{
					opacite=0;
				}
				//nouveau_texte = texte.replace(/alpha\(opacity=([0-9]*)\)/, 'alpha(opacity=' + opacite + ')');
				nouveau_texte = 'alpha(opacity=' + opacite + ')';
				this.calque1.style.filter = nouveau_texte;
			}

			setTimeout("monDiaporama[" + this.id_diaporama + "].progressionChangeDiapoFlou()", this.frequence);
		}
		else
		{	// inversion des calques
			this.calque1.style.zIndex = 1; // le calque écrasé passe au dessous
			this.calque2.style.zIndex = 2; // le calque visible passe au dessus
			this.calque1.style.opacity = 1; // le calque du dessous reprends sa taille initiale
			if (this.calque1.style.filter)
			{
				this.calque1.style.filter = 'alpha(opacity=100)';
			}

			// Mise en place d'une nouvelle image dans le calque qui se trouve en arrière
			this.calque1.style.backgroundImage = "url('" + this.diapo[this.indexDiapo].src + "')";
			this.indexDiapo++;
			if (this.indexDiapo >= this.diapo.length) this.indexDiapo = 0;

			//inversion des références des calques car seul calque1 rétrécit
			calqueTemp = this.calque2;
			this.calque2 = this.calque1;
			this.calque1 = calqueTemp;

			if ( !(document.getElementById('cb_defilement_' + this.id_diaporama)) || document.getElementById('cb_defilement_' + this.id_diaporama).checked )
			{
				setTimeout("monDiaporama[" + this.id_diaporama + "].progressionChangeDiapoFlou()", this.delai);
			}
			else
			{
				setTimeout("monDiaporama[" + this.id_diaporama + "].pause()", this.delai);
			}
		}
	}

	function pause()
	{
		if ( !(document.getElementById('cb_defilement_' + this.id_diaporama)) || document.getElementById('cb_defilement_' + this.id_diaporama).checked )
		{
			if (this.typeTransition == "slide")
			{
				setTimeout("monDiaporama[" + this.id_diaporama + "].progressionChangeDiapoH()", this.delai);
			}
			else if (this.typeTransition == "flou")
			{
				setTimeout("monDiaporama[" + this.id_diaporama + "].progressionChangeDiapoFlou()", this.delai);
			}
		}
		else
		{
			setTimeout("monDiaporama[" + this.id_diaporama + "].pause()", 1000);
		}
	}

	function placeDiaporama()
	{
		document.write('<table align="center" border="' + this.epaisseurCadre + '" bordercolor="' + this.couleurCadre + '" cellpadding="0" cellspacing="0" style="border-style:solid; border-width:' + this.epaisseurCadre + '"><tr><td valign="top">'); // début du tableau pour le cadre
		document.write('<table align="center" border="0" cellpadding="0" cellspacing="0">');
		document.write('<tr height="' + this.hauteurMax + '">');
		document.write('<td width="' + this.largeurMax + '" valign="top" align="left" style="width:' + this.largeurMax + '">');
		document.write('<img src="' + this.diapo[0].src + '" width="' + this.largeurMax + '" height="0" border="0" style="visibility:hidden; border:0; width:' + this.largeurMax + '; height:0"><div></div>'); // je réutilise une des images à la place d'un pixel transparent
		document.write('<div id="div_diapo2_' + this.id_diaporama + '" style="position:absolute; display:block; width:' + this.largeurMax + '; height:' + this.hauteurMax + '; overflow:hidden; background-image:url(\'' + this.diapo[1].src + '\'); opacity:1; filter: alpha(opacity=100)"><table align="left" border="0" cellpadding="0" cellspacing="0"><tr height="' + this.hauteurMax + '"><td width="' + this.largeurMax + '"></td></tr></table></div>');
		document.write('<div id="div_diapo1_' + this.id_diaporama + '" style="position:absolute; display:block; width:' + this.largeurMax + '; height:' + this.hauteurMax + '; overflow:hidden; background-image:url(\'' + this.diapo[0].src + '\'); opacity:1; filter: alpha(opacity=100)"><table align="left" border="0" cellpadding="0" cellspacing="0"><tr height="' + this.hauteurMax + '"><td width="' + this.largeurMax + '"></td></tr></table></div>');
		document.write('</td></tr><tr><td width="' + this.largeurMax + '"><center><i><div id="div_chargement_' + this.id_diaporama + '" height="20" class="diaporama_cmd">Chargement...</div></i></center></td></tr></table>');
		document.write('</td></tr></table>'); // fin du tableau pour le cadre

		this.calque1 = document.getElementById('div_diapo1_' + this.id_diaporama);
		this.calque2 = document.getElementById('div_diapo2_' + this.id_diaporama);

		this.calque1.style.height = this.hauteurMax;
		this.calque2.style.height = this.hauteurMax;
		this.calque1.style.width = this.largeurMax;
		this.calque2.style.width = this.largeurMax;
		this.calque1.style.zIndex = 2; // dessus
		this.calque2.style.zIndex = 1; // dessous
	}

	function testImagesOk()
	{
		this.nbImagesOk = 0;
		// boucle pour compter le nombre d'images chargées
		nbImagesOk = 0;
		for (i=0; i<this.diapo.length;i++)
		{
			if (this.diapo[i].complete) nbImagesOk++;
		}
		document.getElementById('div_chargement_' + this.id_diaporama).innerHTML = "Images chargées : " + nbImagesOk + "/" + this.diapo.length;

		if ( nbImagesOk >= this.diapo.length)
		{
			if (this.masquePanneauCommande)
			{
				panneauCommande = '';
			}
			else
			{
				panneauCommande = '<input id="cb_defilement_' + this.id_diaporama + '" type="checkbox" CHECKED>automatique';
			}
			document.getElementById('div_chargement_' + this.id_diaporama).innerHTML = panneauCommande;
			if (this.typeTransition == "slide")
			{
				setTimeout("monDiaporama[" + this.id_diaporama + "].progressionChangeDiapoH()", this.delai);
			}
			else if (this.typeTransition == "flou")
			{
				setTimeout("monDiaporama[" + this.id_diaporama + "].progressionChangeDiapoFlou()", this.delai);
			}
		}
		else
		{
			setTimeout("monDiaporama[" + this.id_diaporama + "].testImagesOk()", 1000);
		}
	}

	function masquerPanneauCommande()
	{
		this.masquePanneauCommande = true;
	}

	function ajouteCadre(epaisseur, couleur)
	{
		this.epaisseurCadre = epaisseur;
		this.couleurCadre = couleur;
	}

	// liaison des fonctions à l'objet
	Diaporama.prototype.ajoutePhoto = ajoutePhoto;
	Diaporama.prototype.progressionChangeDiapoH = progressionChangeDiapoH;
	Diaporama.prototype.progressionChangeDiapoFlou = progressionChangeDiapoFlou;
	Diaporama.prototype.pause = pause;
	Diaporama.prototype.placeDiaporama = placeDiaporama;
	Diaporama.prototype.testImagesOk = testImagesOk;
	Diaporama.prototype.masquerPanneauCommande = masquerPanneauCommande;
	Diaporama.prototype.ajouteCadre = ajouteCadre;

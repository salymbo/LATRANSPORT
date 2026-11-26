param(
  [string]$Source = "$PSScriptRoot\..\Logo.png",
  [string]$OutFull = "$PSScriptRoot\..\public\logo.png",
  [string]$OutMark = "$PSScriptRoot\..\public\logo-mark.png"
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# 1. Charger dans un vrai bitmap 32 bits (sinon LockBits perd le canal alpha)
$src = [System.Drawing.Bitmap][System.Drawing.Image]::FromFile($Source)
$w = $src.Width
$h = $src.Height
$bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g0 = [System.Drawing.Graphics]::FromImage($bmp)
$g0.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$g0.DrawImage($src, (New-Object System.Drawing.Rectangle 0, 0, $w, $h))
$g0.Dispose()
$src.Dispose()

# 2. Détourage : blanc -> transparent (alpha = 1 - min(R,G,B)/255), couleur dé-prémultipliée
$rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
$data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride = $data.Stride
$buf = New-Object byte[] ($stride * $h)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $buf, 0, $buf.Length)

for ($y = 0; $y -lt $h; $y++) {
  $row = $y * $stride
  for ($x = 0; $x -lt $w; $x++) {
    $i = $row + $x * 4
    $b = $buf[$i]; $g = $buf[$i + 1]; $r = $buf[$i + 2]
    $min = [Math]::Min($r, [Math]::Min($g, $b))
    $a = 255 - $min
    if ($a -le 6) {
      $buf[$i] = 0; $buf[$i + 1] = 0; $buf[$i + 2] = 0; $buf[$i + 3] = 0
      continue
    }
    $af = $a / 255.0
    $nr = [Math]::Round(($r - 255 * (1 - $af)) / $af)
    $ng = [Math]::Round(($g - 255 * (1 - $af)) / $af)
    $nb = [Math]::Round(($b - 255 * (1 - $af)) / $af)
    $buf[$i] = [byte][Math]::Max(0, [Math]::Min(255, $nb))
    $buf[$i + 1] = [byte][Math]::Max(0, [Math]::Min(255, $ng))
    $buf[$i + 2] = [byte][Math]::Max(0, [Math]::Min(255, $nr))
    $buf[$i + 3] = [byte]$a
  }
}

[System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $data.Scan0, $buf.Length)
$bmp.UnlockBits($data)

# 3. Recadrage sur le contenu réel
$minX = $w; $minY = $h; $maxX = 0; $maxY = 0
for ($y = 0; $y -lt $h; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    if ($bmp.GetPixel($x, $y).A -gt 24) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}

$pad = 4
$minX = [Math]::Max(0, $minX - $pad); $minY = [Math]::Max(0, $minY - $pad)
$maxX = [Math]::Min($w - 1, $maxX + $pad); $maxY = [Math]::Min($h - 1, $maxY + $pad)
$cw = $maxX - $minX + 1
$ch = $maxY - $minY + 1

# Clone = copie exacte, sans compositing (l'alpha est conservé)
$fullRect = New-Object System.Drawing.Rectangle $minX, $minY, $cw, $ch
$full = $bmp.Clone($fullRect, $bmp.PixelFormat)
$full.Save($OutFull, [System.Drawing.Imaging.ImageFormat]::Png)

# 4. Marque carrée : emblème du haut (camion + anneau), sans le texte
$markH = [int]($ch * 0.66)
$markRect = New-Object System.Drawing.Rectangle 0, 0, $cw, $markH
$mark = $full.Clone($markRect, $full.PixelFormat)
$mark.Save($OutMark, [System.Drawing.Imaging.ImageFormat]::Png)

$mark.Dispose(); $full.Dispose(); $bmp.Dispose()

"logo.png      : $cw x $ch"
"logo-mark.png : $cw x $markH"
